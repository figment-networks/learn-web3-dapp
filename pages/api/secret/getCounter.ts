import type { NextApiRequest, NextApiResponse } from "next";
import { getSafeUrl } from "components/protocols/secret/lib";
import {
  EnigmaUtils,
  SigningCosmWasmClient,
  Secp256k1Pen,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} from "secretjs";

const customFees = {
  send: {
    amount: [{ amount: "80000", denom: "uscrt" }],
    gas: "80000",
  },
};

export default async function connect(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const url = await getSafeUrl();
    const { mnemonic, contractAddress } = req.body;
    console.log(url);
    console.log(mnemonic);
    console.log(contractAddress);

    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const address = pubkeyToAddress(pubkey, "secret");

    // 1. Initialise client
    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
    const client = new SigningCosmWasmClient(
      url,
      address,
      (signBytes) => signingPen.sign(signBytes),
      txEncryptionSeed,
      customFees
    );

    // 2. Get the stored value
    console.log("Querying contract for current count");
    let response = await client.queryContractSmart(contractAddress, {
      get_count: {},
    });
    let count = response.count as number;

    res.status(200).json(count.toString());
  } catch (error) {
    console.log(error);
    res.status(500).json("get counter value failed");
  }
}
