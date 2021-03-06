const frontController = require('../front-controller');
const Client = require('pg').Client;
const DB = require('../util/db.util');

class CategoriesController {

  find(req) {
    const userId = req.headers['x-ms-client-principal-id'];
    return DB.query('select id, name, description from categories where id = $1 and user_id = $2', [req.query.id, userId])
      .then(rows => {
        if (rows && rows.length) {
          return rows[0];
        }
        return { status: 404 }
      })
  }

  list(req, context) {
    context.log(req.headers);
    const userId = req.headers['x-ms-client-principal-id'];
    return DB.query('select id, name, description from categories where user_id = $1', [userId]);
  }

  create(req) {
    const userId = req.headers['x-ms-client-principal-id'];
    const queryParams = [req.body.name, req.body.description, userId];
    return DB.query('insert into categories (name, description, user_id) values ($1, $2, $3) returning *', queryParams);
  }

  update(req) {
    const userId = req.headers['x-ms-client-principal-id'];
    const queryParams = [req.body.name, req.body.description, req.query.id, userId];
    return DB.query('update categories set name = $1, description = $2 where id = $3 and user_id = $4 returning *', queryParams);
  }

  remove(req) {
    const userId = req.headers['x-ms-client-principal-id'];
    return DB.query('delete from categories where id = $1 and user_id = $2', [req.query.id, userId]);
  }
}

module.exports = frontController(new CategoriesController());