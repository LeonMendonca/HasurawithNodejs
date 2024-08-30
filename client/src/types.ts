type Response = {
  data: {
    getAccounts?: GetAccounts;
    getUserByAccountId?: GetUserByAccountId;
  }
}

//QUERY

type GetAccounts = {
  __typename: string;
  accounts?: getAccountsArray[];
  errorMessage?: string;
}

type Error = {
  __typename: string;
  errorMessage: string;
}

//getAccounts
type getAccountsArray = {
  userid?: string;
  username?: string;
  balance?: string;
  accountid?: string;
  wallet?: number;
}

//getUserByAccountId
type GetUserByAccountId = {
  __typename: string;
  username?: string;
  balance?: number;
  errorMessage?: string;
}

//MUTATION

//depositAmount
//transactionAmount
//withdrawAmount

export type { Response };
