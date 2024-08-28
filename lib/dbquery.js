import { connectPg } from "./server.js";
class Postgres {
  static async getAllAccounts() {
    try {
      const result = await connectPg.query(`SELECT * FROM accounts;`);
      return result.rows;
    } catch (error) {
      throw error;
    }
  }
  static async getUserByAccountId(id) {
    try {
      const result = await connectPg.query(`SELECT username, balance FROM accounts WHERE accountid=$1`, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }
  static async withdrawAmountByAccountId(accountid, amount) {
    try {
      const update = await connectPg.query(`
                                           UPDATE accounts SET balance=balance-$1, wallet=wallet+$1 WHERE accountid=$2
                                           RETURNING balance, wallet`, [amount, accountid]);
      return update.rows[0];
    } catch (error) {
      throw error;
    }
  }
  static async getUsersByAccountIds(senderAccId, receiverAccId) {
    try {
      const users = await connectPg.query(`
                                          SELECT username, balance FROM accounts WHERE accountid in ($1, $2) ORDER BY accountid=$1 DESC`, [senderAccId, receiverAccId]);
      return {
        users: users.rows,
        usersCount: users.rowCount
      };
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
}
export { Postgres };