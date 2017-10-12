const pg = require('pg');
const Client = pg.Client;
const Pool = pg.Pool;

class DbUtil {
  static getConnection(context) {
    if (!this.pool) {
      this.pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        min: 1,
        max: 5
      });
      context.log('creating a new pool');
    } else {
      context.log('re-using a pool');
    }
    return this.pool.connect();
  }

  static query(queryString, context) {
    return DbUtil.getConnection(context).then(client => {
      return client.query(queryString).then(res => {
        client.release();
        return res.rows;
      }).catch(e => {
        client.release();
      })
    })
  }
}


module.exports = DbUtil;