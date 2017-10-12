const frontController = require('../front-controller');
const Client = require('pg').Client;
const DB = require('../util/db.util');

class CategoriesController {

  find(req) {
    return new Promise((resolve, reject) => {
      resolve({ id: req.params.id, name: 'Testes depois da promessa' })
    })
  }

  list(req, context) {
    return DB.query('SELECT * from categories', context).then(rows => rows);
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