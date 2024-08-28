import { connectPg } from "./server";

type Deposit = {
  username: string;
  balance: number;
}

type User = {
  userid: string;
  username: string;
  balance: number;
  accountid: string;
  wallet: number;
}

type SingleUser = {
  username: string;
  balance: number;
}

type Wallet = {
  balance: number;
  wallet: number;
}

type TransactionUsers = {
  users: { username: string, balance: number }[];
  userCount: number;
}

class Postgres {
  static async getAllAccounts(): Promise<User[]> {
    try {
      const result = await connectPg.query(`SELECT * FROM accounts;`);
      const allAccounts: User[] = result.rows;
      return allAccounts;
    } catch(error) {
      throw error;
    }
  }

  static async getUserByAccountId(id: string): Promise<SingleUser | undefined> {
    try {
      const result = await connectPg.query(`SELECT username, balance FROM accounts WHERE accountid=$1`,[id]);
      const user: SingleUser | undefined = result.rows[0];
      return user;
    } catch(error) {
      throw error;
    }
  }

  static async withdrawAmountByAccountId(accountid: string, amount: number): Promise<Wallet> {
    try {
      const updated = await connectPg.query(`
                                           UPDATE accounts SET balance=balance-$1, wallet=wallet+$1 WHERE accountid=$2
                                           RETURNING balance, wallet`,[amount, accountid]
                                          );
      const updatedWallet: Wallet = updated.rows[0];
      return updatedWallet;
    } catch (error) {
      throw error;
    }
  }

  static async getUsersByAccountIds(senderAccId: string, receiverAccId: string): Promise<TransactionUsers> {
    try {
      const users = await connectPg.query(`
                                          SELECT username, balance FROM accounts WHERE accountid in ($1, $2) 
                                          ORDER BY accountid=$1 DESC`,[senderAccId, receiverAccId]);
      const updatedTransaction: TransactionUsers = { users: users.rows, userCount: users.rowCount as number };
      return updatedTransaction;
    } catch (error) {
      throw error;
    }
  }

  static async transactionAmountByAccountId(senderAccId: string, receiverAccId: string, amount: number): Promise<void> {
    try {
      await connectPg.query(`
                            UPDATE accounts SET balance = CASE
                            WHEN accountid=$1 THEN balance-$3
                            WHEN accountid=$2 THEN balance+$3
                            END
                            WHERE accountid IN ($1, $2) 
                            RETURNING username, balance`,[senderAccId, receiverAccId, amount]);
    } catch (error) {
      throw error;
    }
  }

  static async depositAmountByAccoundId(accountid: string, amount: number): Promise<Deposit | undefined> {
    try {
      const updated = await connectPg.query(`
                                            UPDATE accounts SET balance=balance+$1 WHERE accountid=$2 
                                            RETURNING username, balance`,[amount, accountid]);
      const updatedUser: Deposit | undefined = updated.rows[0];
      return updatedUser; 
    } catch (error) {
      throw error;
    }
  }
}
export { Postgres };
