import fetch from "node-fetch";
import { Response } from "./types";

const uri = 'http://localhost:8080/v1/graphql'

const getaccountsQuery = `
query Query {
  getAccounts(secretKey: "0786d52") {
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
}`

const getuseraccidQuery = `
query Query {
  getUserByAccountId(id: "78f15fb8-eb33-4293-b499-e4ef12882c1b") {
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
`

async function getAccounts(query: any) {
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query })
    }); 
    const response = await res.json();
    if(ResponseTypes(response)) {
      console.log(response.data.getAccounts);
    } else {
      throw new Error('Not a valid schema!');
    }
  } catch (error) {
    if(error instanceof Error) {
      console.log(error.message);
      return;
    }
    console.log(error);
  }
}

async function getUserAccountId(query: any) {
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query }),
    });
    const response = await res.json();
    if(ResponseTypes(response)) {
      console.log(response.data.getUserByAccountId);
    }
  } catch (error) { 
    if(error instanceof Error) {
      console.log(error.message);
      return;
    }
    console.log(error);
  }
}

function ResponseTypes(response: unknown): response is Response {
  if(response && typeof response === 'object' && 'data' in response) {
    return true; 
  }
  return false;
}

//getAccounts(getaccountsQuery);
await getUserAccountId(getuseraccidQuery);
