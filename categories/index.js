const frontController = require('../front-controller');
const Client = require('pg').Client;
const DB = require('../util/db.util');

class CategoriesController {

  find(req) {
    return DB.query('select * from categories where id = $1', [req.params.id])
      .then(rows => {
        if (rows && rows.length) {
          return rows[0];
        }
        return { status: 404 }
      })
  }

  list(req, context) {
    return DB.query('select * from categories');
  }

  create(req) {
    context.log(req);
    const queryParams = [req.body.name, req.body.description];
    return DB.query('insert into categories (name, description) values($1, $1)', queryParams);
  }

  update(req) {
    const queryParams = [req.body.name, req.body.description, req.params.id];
    return DB.query('update categories set name = $1, description = $2 where id = $3', queryParams);
  }

  remove(req) {
    return DB.query('delete from categories where id = $1', [req.params.id]);
  }
}

module.exports = frontController(new CategoriesController());