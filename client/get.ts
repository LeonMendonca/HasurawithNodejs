import fetch from "node-fetch";

const uri = 'http://localhost:8080/v1/graphql'

const query = `
query Query {
  getAccounts(secretKey: "0786d52f") {
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


async function getAccounts(query: any) {
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query })
    }); 
    const response = await res.json();
    console.log(response);
  } catch (error) {
    if(error instanceof Error) {
      console.log(error.message);
      return;
    }
    console.log(error);
  }
}

getAccounts(query);
