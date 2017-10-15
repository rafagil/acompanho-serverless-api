const frontController = require('../front-controller');
const DB = require('../util/db.util');

class CategoriesController {

  find(req) {
    return DB.query('select * from feeds where id = $1', [req.params.id])
      .then(rows => {
        if (rows && rows.length) {
          return rows[0];
        }
        return { status: 404 }
      })
  }

  list(req, context) {
    context.log(req.params);
    return DB.query('select * from feeds where category_id = $1', [req.params.categoryId]);
  }

  create(req, context) {
    const queryParams = [req.body.name, req.body.description];
    return DB.query('insert into feeds (name, description) values ($1, $2) returning *', queryParams);
  }

  update(req) {
    const queryParams = [req.body.name, req.body.description, req.params.id];
    return DB.query('update categories set name = $1, description = $2 where id = $3 returning *', queryParams);
  }

  remove(req) {
    return DB.query('delete from feeds where id = $1', [req.params.id]);
  }
}

module.exports = frontController(new CategoriesController());