const frontController = require('../front-controller');
const Client = require('pg').Client;
const DB = require('../util/db.util');

class CategoriesController {

  find(req) {
    return DB.query('SELECT * from categories where id = $1', [req.params.id])
      .then(rows => {
        if (rows && rows.length) {
          return rows[0];
        }
        return { status: 404 }
      })
  }

  list(req, context) {
    return DB.query('SELECT * from categories').then(rows => rows);
  }

  create(req) {
    return req.body;
  }

  update(req) {
    return req.body;
  }

  remove(req) {
    return req.body;
  }
}

module.exports = frontController(new CategoriesController());