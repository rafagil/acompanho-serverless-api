const frontController = require('../front-controller');
const DB = require('../util/db.util');

class FeedsController {

  find(req) {
    return DB.query('select * from feeds where id = $1', [req.query.id])
      .then(rows => {
        if (rows && rows.length) {
          return rows[0];
        }
        return { status: 404 }
      })
  }

  list(req, context) {
    context.log(req.query);
    return DB.query('select * from feeds where category_id = $1', [req.query.categoryId]);
  }

  create(req, context) {
    const queryParams = [req.body.name, req.body.description];
    return DB.query('insert into feeds (name, description) values ($1, $2) returning *', queryParams);
  }

  update(req) {
    const queryParams = [req.body.name, req.body.description, req.query.id];
    return DB.query('update categories set name = $1, description = $2 where id = $3 returning *', queryParams);
  }

  remove(req) {
    return DB.query('delete from feeds where id = $1', [req.query.id]);
  }
}

module.exports = frontController(new FeedsController());