import type {NextApiRequest, NextApiResponse} from 'next';

const GRAPHQL_URL = process.env.NEXT_PUBLIC_LOCAL_SUBGRAPH as string;

const TEST_QUERY = `
  query {
    punks {
      id
    }
  }
`;

export default async function node(
  _req: NextApiRequest,
  res: NextApiResponse<boolean | string>,
) {
  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query: TEST_QUERY,
      }),
    });

    const {errors} = await response.json();
    if (errors) {
      throw new Error('GRAPHQL error: Cannot find the subgraph');
    }
    res.status(200).json(true);
  } catch (error) {
    let errorMessage = error instanceof Error ? error.message : 'Unknown Error';
    res.status(500).json(errorMessage);
  }
}
