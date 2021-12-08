import type {NextApiRequest, NextApiResponse} from 'next';
import axios from 'axios';

export default async function node(
  _req: NextApiRequest,
  res: NextApiResponse<boolean | string>,
) {
  try {
    await axios.post(`http://127.0.0.1:8020`, {});
    res.status(200).json(true);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
