const uri = 'http://localhost:8080/v1/graphql';

let counter = 5;
let intervalId;

function count() {
  const timer = document.getElementById('timer');
  timer.innerHTML = counter;
  counter--;

  if (counter < 0) {
    clearInterval(intervalId);
    document.getElementById('accounts').innerHTML = "";
  }
}

const getaccountsBtn = document.getElementById('getAccounts')
getaccountsBtn.addEventListener('click', async (event)=> {
  event.preventDefault();
  const value = document.getElementById('secretkey').value;

  const div = document.getElementById('accounts');
  const data = await getAccounts(value);
  div.innerHTML = JSON.stringify(data);
  
  counter = 5;
  intervalId = setInterval(count, 1000);
});

//secret key - 0786d52f
async function getAccounts(secretkey) {
  const query = `
  query Query {
    getAccounts(secretKey: "${secretkey}") {
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
  }`;

  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });
    const response = await res.json();
    if (ResponseTypes(response)) {
      return response.data.getAccounts;
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
      return;
    }
    console.log(error);
  }
}

function ResponseTypes(response) {
  if (response && typeof response === 'object' && 'data' in response) {
    return true;
  }
  return false;
}
