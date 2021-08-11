import type { NextApiRequest, NextApiResponse } from "next";
import { getSafeUrl } from "@secret/lib";
import { Bip39, Random } from "@iov/crypto";
import {
  CosmWasmClient,
  Secp256k1Pen,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} from "secretjs";

type ResponseT = {
  mnemonic: string;
  address: string;
};

export default async function connect(
  _req: NextApiRequest,
  res: NextApiResponse<ResponseT | string>
) {
  try {
    const url = await getSafeUrl();
    const client = new CosmWasmClient(url);

    const mnemonic = Bip39.encode(Random.getBytes(16)).toString();
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const address = pubkeyToAddress(pubkey, "secret");
    const account = await client.getAccount(address);

    console.log("mnemonic: ", mnemonic);
    console.log("address: ", address);
    console.log("account: ", account);

    res.status(200).json({ mnemonic, address });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error connecting to Secret");
  }
}
