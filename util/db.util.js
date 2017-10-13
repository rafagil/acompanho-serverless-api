const Log = require('./log.util');
const pg = require('pg');
const Client = pg.Client;
const Pool = pg.Pool;

class DbUtil {
  static getConnection() {
    if (!this.pool) {
      this.pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        min: 1,
        max: 5
      });
      Log.log('Started a new pool');
    }
    return this.pool.connect();
  }

  static query(queryString, params) {
    return DbUtil.getConnection().then(client => (
      client.query(queryString, params).then(res => {
        client.release();
        return res.rows;
      }).catch(e => {
        client.release();
        throw e;
      })
    ));
  }
}


module.exports = DbUtil;