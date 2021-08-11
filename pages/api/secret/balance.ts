import type { NextApiRequest, NextApiResponse } from "next";
import { getSafeUrl } from "components/protocols/secret/lib";
import { CosmWasmClient } from "secretjs";

export default async function connect(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  try {
    const url = await getSafeUrl();
    console.log(url);

    const { address } = req.body;
    console.log(address);

    const client = new CosmWasmClient(url);
    const account = await client.getAccount(address);
    console.log(account);
    const balance = account?.balance[0].amount;
    console.log("balance: ", balance);

    res.status(200).json(balance as string);
  } catch (error) {
    console.log(error);
    res.status(500).json("failed to connect to secret");
  }
}
