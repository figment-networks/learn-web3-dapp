import {gql} from '@apollo/client';

const MOST_VALUABLE_PUNKS_QUERY = gql`
  query {
    punks(first: 1) {
      id
    }
  }
`;

export default MOST_VALUABLE_PUNKS_QUERY;
