const uri = 'http://localhost:8080/v1/graphql';

const getuserBtn = document.getElementById('getUser');
getuserBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const value = document.getElementById('accid').value

  const div = document.getElementById('accounts');
  const data = await getUserAccountId(value)
  div.innerHTML = JSON.stringify(data);
});

//account id - 78f15fb8-eb33-4293-b499-e4ef12882c1b
async function getUserAccountId(accountid) {
  const query = `
  query Query {
    getUserByAccountId(id: "${accountid}") {
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
  `;
  try {
    const res = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query
      })
    });
    const response = await res.json();
    if (ResponseTypes(response)) {
      return response.data.getUserByAccountId
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
