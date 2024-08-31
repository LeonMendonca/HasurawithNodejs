# Overview
This API is powered by Apollo Server [docs](https://www.apollographql.com/docs/apollo-server/getting-started/), and based on GraphQL API architecture.
**Why GraphQL?** 
- GraphQL provides a flexible and efficient way to query and mutate data.
- Clients has to authority to specify exactly what data they need, and how much is needed.
- It reduces Over-fetching and Under-fetching, resulting in lesser and sufficient Payload as required.
- You only need to have a single endpoint.

# Base URL
>`http://localhost:4000`
# Endpoint
>`POST http://localhost:4000/`
# Query Structure
> Root Type : Query
  - To get all Accounts
```graphql
query Query {
  getAccounts(secretKey: "<AdminKey>") {
    ... on Accounts {
      __typename
      accounts {
        accountid
        balance
        userid
        username
        wallet
      }
    }
    ... on Error {
      __typename
      errorMessage
    }
  }
}
```
