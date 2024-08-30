const uri = 'http://localhost:8080/v1/graphql';

const withdrawBtn = document.getElementById('withDraw');
withdrawBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const accountid = document.getElementById('accid').value;
  const amount = document.getElementById('amount').value;
  
  const div = document.getElementById('accounts');
  const data = await withdrawAmount(accountid, amount);
  div.innerHTML = JSON.stringify(data);
})

async function withdrawAmount(accountid, amount) {
  const query = `
    mutation Mutation {
      withdrawAmount(accountid: "${accountid}", amount: ${amount}) {
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
    }`;
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query })
    });
    const response = await res.json();
    if (ResponseTypes(response)) {
      return response.data.withdrawAmount;
    } else {
      throw new Error('Something went wrong!');
    }
  } catch (error) {
    if(error instanceof Error) {
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

