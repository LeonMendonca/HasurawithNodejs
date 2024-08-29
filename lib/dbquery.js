import { connectPg } from "./server.js";
class Postgres {
  static async getAllAccounts() {
    try {
      const result = await connectPg.query(`SELECT * FROM accounts;`);
      const allAccounts = result.rows;
      return allAccounts;
    } catch (error) {
      throw error;
    }
  }
  static async getUserByAccountId(id) {
    try {
      const result = await connectPg.query(`SELECT username, balance FROM accounts WHERE accountid=$1`, [id]);
      const user = result.rows[0];
      return user;
    } catch (error) {
      throw error;
    }
  }
  static async withdrawAmountByAccountId(accountid, amount) {
    try {
      const updated = await connectPg.query(`
                                           UPDATE accounts SET balance=balance-$1, wallet=wallet+$1 WHERE accountid=$2
                                           RETURNING balance, wallet`, [amount, accountid]);
      const updatedWallet = updated.rows[0];
      return updatedWallet;
    } catch (error) {
      throw error;
    }
  }
  static async getUsersByAccountIds(senderAccId, receiverAccId) {
    try {
      const users = await connectPg.query(`
                                          SELECT username, balance FROM accounts WHERE accountid in ($1, $2) 
                                          ORDER BY accountid=$1 DESC`, [senderAccId, receiverAccId]);
      const updatedTransaction = {
        users: users.rows,
        userCount: users.rowCount
      };
      return updatedTransaction;
    } catch (error) {
      throw error;
    }
  }
  static async transactionAmountByAccountId(senderAccId, receiverAccId, amount) {
    try {
      await connectPg.query(`
                            UPDATE accounts SET balance = CASE
                            WHEN accountid=$1 THEN balance-$3
                            WHEN accountid=$2 THEN balance+$3
                            END
                            WHERE accountid IN ($1, $2) 
                            RETURNING username, balance`, [senderAccId, receiverAccId, amount]);
    } catch (error) {
      throw error;
    }
  }
  static async depositAmountByAccoundId(accountid, amount) {
    try {
      const updated = await connectPg.query(`
                                            UPDATE accounts SET balance=balance+$1 WHERE accountid=$2 
                                            RETURNING username, balance`, [amount, accountid]);
      const updatedUser = updated.rows[0];
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
export { Postgres };