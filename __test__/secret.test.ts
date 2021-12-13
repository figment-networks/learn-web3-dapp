import {getNodeUrl} from 'components/protocols/secret/lib';
import {
  EnigmaUtils,
  SigningCosmWasmClient,
  CosmWasmClient,
  Secp256k1Pen,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} from 'secretjs';
import {Bip39, Random} from '@iov/crypto';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({path: path.resolve('.env.local')});

// Avoid jest open handle error
afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 10000));
});

const client = new CosmWasmClient(getNodeUrl());

function getSecretExplorerURL(txHash: string) {
  return `https://secretnodes.com/secret/chains/supernova-2/transactions/${txHash}`;
}

async function getSigningPenFromMnemonic(mnemonic: string) {
  return await Secp256k1Pen.fromMnemonic(mnemonic);
}

async function getAddressFromMnemonic(mnemonic: string) {
  const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
  return pubkeyToAddress(encodeSecp256k1Pubkey(signingPen.pubkey), 'secret');
}

async function getBalanceFromMnemonic(mnemonic: string) {
  const account = await client.getAccount(
    await getAddressFromMnemonic(mnemonic),
  );
  return account?.balance[0].amount as string;
}

async function connection() {
  return await client.restClient.nodeInfo();
}

async function keypair(mnemonic: string) {
  if (!mnemonic) {
    const randomMnemonic = Bip39.encode(Random.getBytes(16)).toString();
    console.log('Generated mnemonic:', randomMnemonic);
    const signingPen = await Secp256k1Pen.fromMnemonic(randomMnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const address = pubkeyToAddress(pubkey, 'secret');
    console.log('Address of generated mnemonic:', address);
    return address as string;
  } else {
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const address = pubkeyToAddress(pubkey, 'secret');
    return address as string;
  }
}

async function balance(mnemonic: string) {
  try {
    return getBalanceFromMnemonic(mnemonic);
  } catch (error) {
    console.log(
      `Get balance for ${getAddressFromMnemonic(mnemonic)} error:`,
      error,
    );
  }
}

async function transfer(recipient: string, sender: string) {
  const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
  const TX_AMOUNT = '100000';

  const fees = {
    send: {
      amount: [{amount: '80000', denom: 'uscrt'}],
      gas: '80000',
    },
  } as object;

  const signingPenSender = await getSigningPenFromMnemonic(sender);
  const senderAddress = pubkeyToAddress(
    encodeSecp256k1Pubkey(signingPenSender.pubkey),
    'secret',
  ) as string;

  const signingPenRecipient = await getSigningPenFromMnemonic(recipient);
  const receiverAddress = pubkeyToAddress(
    encodeSecp256k1Pubkey(signingPenRecipient.pubkey),
    'secret',
  ) as string;

  const client = new SigningCosmWasmClient(
    getNodeUrl() as string,
    senderAddress as string,
    (signBytes) => signingPenSender.sign(signBytes),
    txEncryptionSeed as Uint8Array,
    fees as object,
  );

  const sent = await client.sendTokens(
    receiverAddress as string,
    [
      {
        amount: TX_AMOUNT as string,
        denom: 'uscrt' as string,
      },
    ],
    'Testing sendTokens()',
  );

  console.log(
    `${senderAddress} to ${receiverAddress} : \n${getSecretExplorerURL(
      sent.transactionHash,
    )}`,
  );

  return sent;
}

/**
 * Test cases
 *
 * FUNDED     - spot history divert episode dove van unable hire bargain legal improve hurdle       // secret1v4n4du5w02degaalj682p03pjkthf4cund49hc
 * NOT FUNDED - expose ring elevator critic panther injury trigger person butter rescue local where // secret1xy0h5qpfssl20vfcx8a2cham6cmrr8mnl9ln4g
 * NOT FUNDED - multiply horror waste this enemy glue act dream camp reopen trophy brick            // secret1xangfqmzvdlf2z44mrv30nar6mv43ma7pc7k2j
 */

describe('Secret backend tests', () => {
  // Avoid jest open handle error
  jest.setTimeout(30000);

  test('Connection', async () => {
    await expect(connection()).resolves.toHaveProperty(
      'application_version.version',
    );
  });

  test('Generate keypair', async () => {
    await expect(keypair('')).resolves.toHaveLength(45);
  });

  test('Keypair from mnemonic', async () => {
    await expect(
      keypair(
        'multiply horror waste this enemy glue act dream camp reopen trophy brick',
      ),
    ).resolves.toHaveLength(45);
  });

  test('Funded balance', async () => {
    await expect(
      balance(
        'spot history divert episode dove van unable hire bargain legal improve hurdle',
      ), // secret1v4n4du5w02degaalj682p03pjkthf4cund49hc
    ).resolves.toBeDefined();
  });

  test('Not funded balance', async () => {
    await expect(
      balance(
        'multiply horror waste this enemy glue act dream camp reopen trophy brick',
      ), // secret1xangfqmzvdlf2z44mrv30nar6mv43ma7pc7k2j
    ).resolves.toBeUndefined();
  });

  test('Transfer', async () => {
    await expect(
      transfer(
        'expose ring elevator critic panther injury trigger person butter rescue local where',
        'spot history divert episode dove van unable hire bargain legal improve hurdle',
      ),
    ).resolves.toBeDefined();
  });
});
