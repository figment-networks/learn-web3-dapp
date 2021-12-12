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
      logs(where: {event_in: ["putDID"]}) {
        id
        did
        accountId
        registered
      }
    }
    `;
