import type {NextApiRequest, NextApiResponse} from 'next';
import fs from 'fs';

export default async function scallfold(
  _req: NextApiRequest,
  res: NextApiResponse<boolean | string>,
) {
  try {
    fs.readFileSync('./subgraphs/punks/subgraph.yaml', 'utf8');
    res.status(200).json(true);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
