const frontController = require('../front-controller');
const DB = require('../util/db.util');
const FeedUtil = require('../util/feed.util');

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
    const params = [req.headers['x-ms-client-principal-id']];
    let query = `select feeds.* from feeds 
      join categories on categories.id = feeds.category_id 
      where categories.user_id = $1`;
    if (req.query.categoryId) {
      query += ' and category_id = $2';
      params.push(req.query.categoryId);
    }
    return DB.query(query, params);
  }

  create(req, context) {
    return FeedUtil.parseFeedMeta(req.body.url).then((feed) => {
      const queryParams = [feed.title, feed.description, feed.link, feed.url, req.query.categoryId];
      return DB.query('insert into feeds (title, description, link, url, category_id) values ($1, $2, $3, $4, $5) returning *', queryParams);
    });
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