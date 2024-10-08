import { Postgres } from "./dbquery.js";
const typeDefs = `
  type Error {
    errorMessage : String!
  }

  #****************# 
  type Account {
    userid: ID!
    username: String!
    balance: Int!
    accountid: ID!
    wallet: Int!
  }
  type Accounts {
    accounts: [Account]
  }

  union AccountError = Accounts | Error
  #****************# 


  #****************# 
  type User {
    username: String!
    balance: Int!
  } 

  union UserError = User | Error
  #****************# 

  #****************# 
  type Wallet {
    message: String!
    wallet: Int!
  }
  
  union WalletError = Wallet | Error
  #****************# 

  #****************# 
  type Transaction {
    message: String!
    transactionAmount: Int!
  }

  union TransactionError = Transaction | Error
  #****************# 

  #****************# 
  type Deposit {
    username: String!
    depositAmount: Int!
  }

  union DepositError = Deposit | Error
  #****************# 

  type Query {
    getAccounts(secretKey: String!): AccountError
    getUserByAccountId(id: ID!): UserError
  }

  type Mutation {
    withdrawAmount(accountid: ID!, amount: Int): WalletError
    transactionAmount(senderAccId: ID!, receiverAccId: ID!, amount: Int!): TransactionError
    depositAmount(accountid: ID!, amount: Int): DepositError
  }
`;
const resolvers = {
  AccountError: {
    __resolveType(obj) {
      if ('accounts' in obj && obj.accounts) {
        return 'Accounts';
      }
      if ('errorMessage' in obj && obj.errorMessage) {
        return 'Error';
      }
      return null;
    }
  },
  UserError: {
    __resolveType(obj) {
      if ('username' in obj && obj.username) {
        return 'User';
      }
      if ('errorMessage' in obj && obj.errorMessage) {
        return 'Error';
      }
      return null;
    }
  },
  WalletError: {
    __resolveType(obj) {
      if ('wallet' in obj && obj.wallet) {
        return 'Wallet';
      }
      if ('errorMessage' in obj && obj.errorMessage) {
        return 'Error';
      }
    }
  },
  TransactionError: {
    __resolveType(obj) {
      if ('transactionAmount' in obj && obj.transactionAmount) {
        return 'Transaction';
      }
      if ('errorMessage' in obj && obj.errorMessage) {
        return 'Error';
      }
    }
  },
  DepositError: {
    __resolveType(obj) {
      if ('depositAmount' in obj && obj.depositAmount) {
        return 'Deposit';
      }
      if ('errorMessage' in obj && obj.errorMessage) {
        return 'Error';
      }
      return null;
    }
  },
  Query: {
    getAccounts: async (_parent, arg) => {
      try {
        const {
          secretKey
        } = arg;
        if (secretKey === '0786d52f') {
          return {
            accounts: await Postgres.getAllAccounts()
          };
        }
        throw new Error('Invalid admin key');
      } catch (error) {
        if (error instanceof Error) {
          return {
            errorMessage: error.message
          };
        }
      }
    },
    getUserByAccountId: async (_parent, arg) => {
      try {
        const {
          id
        } = arg;
        const user = await Postgres.getUserByAccountId(id);
        if (!user) {
          throw new Error('No user found');
        }
        return user;
      } catch (error) {
        if (error instanceof Error) {
          return {
            errorMessage: error.message
          };
        }
      }
    }
  },
  Mutation: {
    withdrawAmount: async (_parent, arg) => {
      try {
        const {
          accountid,
          amount
        } = arg;
        if (isNaN(amount)) {
          throw new Error('Please provide valid amount');
        }
        const user = await Postgres.getUserByAccountId(accountid);
        if (!user) {
          throw new Error('No user found');
        }
        if (user.balance < amount) {
          throw new Error(`Insufficient balance ${user.balance}! Withdrawal failed!`);
        }
        const updatedUser = await Postgres.withdrawAmountByAccountId(accountid, amount);
        return {
          message: `Withdrawal successful ${updatedUser.balance} remaining`,
          wallet: updatedUser.wallet
        };
      } catch (error) {
        if (error instanceof Error) {
          return {
            errorMessage: error.message
          };
        }
      }
    },
    transactionAmount: async (_parent, arg) => {
      try {
        const {
          senderAccId,
          receiverAccId,
          amount
        } = arg;
        const users = await Postgres.getUsersByAccountIds(senderAccId, receiverAccId);
        if (users.userCount != 2) {
          throw new Error('Invalid account ID');
        }
        const sender = users.users[0];
        //const receiver = users.users[1];
        if (sender.balance < amount) {
          throw new Error(`Transaction failed! ${sender.username}'s balance is insufficient - ${sender.balance}`);
        }
        await Postgres.transactionAmountByAccountId(senderAccId, receiverAccId, amount);
        return {
          message: `Transaction successful!`,
          transactionAmount: amount
        };
      } catch (error) {
        if (error instanceof Error) {
          return {
            errorMessage: error.message
          };
        }
      }
    },
    depositAmount: async (_parent, arg) => {
      try {
        const {
          accountid,
          amount
        } = arg;
        const updatedUser = await Postgres.depositAmountByAccoundId(accountid, amount);
        if (!updatedUser) {
          throw new Error('Invalid accound ID');
        }
        return {
          username: updatedUser.username,
          depositAmount: amount
        };
      } catch (error) {
        if (error instanceof Error) {
          return {
            errorMessage: error.message
          };
        }
      }
    }
  }
};
export { typeDefs, resolvers };