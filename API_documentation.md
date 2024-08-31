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
## Query Structure
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
  - To get a single Account
```graphql
query Query {
  getUserByAccountId(id: "<AccountId>") {
    ... on User {
      __typename
      username
      balance
    }
    ... on Error {
      __typename
      errorMessage
    }
  }
}
```
## Mutation Structure
>Root type : Mutation
  - To withdraw amount and store it in wallet
```graphql
mutation Mutation {
  withdrawAmount(accountid: "<AccountId>", amount: 0) {
    ... on Wallet {
      __typename
      message
      wallet
    }
    ... on Error {
      __typename
      errorMessage
    }
  }
}
```
  - To deposit amount
```graphql
mutation Mutation {
  depositAmount(accountid: "", amount: 10) {
    ... on Deposit {
      __typename
      username
      depositAmount
    }
    ... on Error {
      __typename
      errorMessage
    }
  }
}
```
  - To perform transaction between 2 users
```graphql
mutation Mutation {
  transactionAmount(amount: 0, receiverAccId: "", senderAccId: "") {
    ... on Transaction {
      __typename
      message
      transactionAmount
    }
    ... on Error {
      __typename
      errorMessage
    }
  }
}
```
