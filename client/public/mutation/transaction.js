const uri = 'http://localhost:8080/v1/graphql';

const transactionBtn = document.getElementById('transaction');
transactionBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const saccountid = document.getElementById('senderaccid').value;
  const raccountid = document.getElementById('receiveraccid').value;
  const amount = document.getElementById('amount').value;
  
  const div = document.getElementById('accounts');
  const data = await transactionAmount(amount, saccountid, raccountid);
  div.innerHTML = JSON.stringify(data);
})


async function transactionAmount (amount, senderAccId, receiverAccid) {
  const query = `
    mutation Mutation {
      transactionAmount(amount: ${amount}, senderAccId: "${senderAccId}", receiverAccId: "${receiverAccid}") {
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
    }`;
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ query })
    });
    const response = await res.json();
    if (ResponseTypes(response)) {
      return response.data.transactionAmount;
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

