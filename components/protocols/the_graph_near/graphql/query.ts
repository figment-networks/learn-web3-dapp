export const DID_QUERY_MAPPING = `
query{
    accounts{
        id
        log
    }
}
`;

export const DID_QUERY = `
    query{
      logs(first: 5, orderBy: registered, orderDirection: desc, where: {event_in: ["putDID"]}) {
        id
        did
        accountId
        registered
      }
    }
    `;
