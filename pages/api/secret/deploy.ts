import type { NextApiRequest, NextApiResponse } from "next";
import { getSafeUrl } from "@secret/lib";
import {
  EnigmaUtils,
  SigningCosmWasmClient,
  Secp256k1Pen,
  pubkeyToAddress,
  encodeSecp256k1Pubkey,
} from "secretjs";
import fs from "fs";

const CONTRACT_PATH = "./contracts/secret/contract.wasm";

const customFees = {
  upload: {
    amount: [{ amount: "2000000", denom: "uscrt" }],
    gas: "2000000",
  },
  init: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
  },
  exec: {
    amount: [{ amount: "500000", denom: "uscrt" }],
    gas: "500000",
  },
  send: {
    amount: [{ amount: "80000", denom: "uscrt" }],
    gas: "80000",
  },
};

type ResponseT = {
  contractAddress: string;
  transactionHash: string;
};
export default async function connect(
  req: NextApiRequest,
  res: NextApiResponse<ResponseT | string>
) {
  try {
    const url = await getSafeUrl();
    const { mnemonic } = req.body;

    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const address = pubkeyToAddress(pubkey, "secret");

    // 1. Initialize client
    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
    const client = new SigningCosmWasmClient(
      url,
      address,
      (signBytes) => signingPen.sign(signBytes),
      txEncryptionSeed,
      customFees
    );

    // 2. Upload the contract wasm
    const wasm = fs.readFileSync(CONTRACT_PATH);
    console.log("Uploading contract");
    const uploadReceipt = await client.upload(wasm, {});

    // Get the code ID from the receipt
    const { codeId } = uploadReceipt;

    // 3 Create an instance of the Counter contract, providing a starting count
    const initMsg = { count: 101 };

    if (!uploadReceipt) {
      throw new Error("uploadReceipt error");
    }
    const contract = await client.instantiate(
      codeId,
      initMsg,
      `My Counter${Math.ceil(Math.random() * 10000)}`
    );
    console.log(contract);

    res.status(200).json({
      contractAddress: contract.contractAddress,
      transactionHash: contract.transactionHash,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json("Error deploying contract");
  }
}
