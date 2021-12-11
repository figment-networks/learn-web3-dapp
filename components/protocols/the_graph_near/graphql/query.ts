import {gql} from '@apollo/client';

const MOST_VALUABLE_PUNKS_QUERY = gql`
  query {
    punks(first: 1) {
      id
    }
  }
`;

const DID_QUERY = gql`
  query {
    accounts(first: 10) {
      id
      log
    }
  }
`;

export default DID_QUERY;
