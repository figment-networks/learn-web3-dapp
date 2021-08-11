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
  exec: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
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

    // 2. Increment the counter
    const handleMsg = { increment: {} };
    console.log("Updating count");
    const response = await client.execute(contractAddress, handleMsg);

    res.status(200).json(response.transactionHash);
  } catch (error) {
    console.log(error);
    res.status(500).json("set counter value failed");
  }
}
