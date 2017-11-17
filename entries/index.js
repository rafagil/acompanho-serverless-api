const frontController = require('../front-controller');
const DB = require('../util/db.util');
const FeedUtil = require('../util/feed.util');

class EntriesController {

  find(req) {
    return DB.query('update entries set unread = false where id = $1 returning *', [req.query.id])
      .then(rows => {
        if (rows && rows.length) {
          return rows[0];
        }
        return { status: 404 }
      })
  }

  list(req) {
    const pageSize = 20; //TODO, think a better way to handle this.
    let { page } = req.query;
    if (!page) {
      page = 0;
    } else {
      page = page - 1;
    }

    const countQuery = 'select count(1) from entries where feed_id = $1';
    const query = `select * from entries
                   where feed_id = $1
                   order by pubdate desc
                   limit $2 offset $3`;
    return DB.query(countQuery, [req.query.feedId]).then(countRows => {
      const count = countRows[0].count;
      return DB.query(query, [req.query.feedId, pageSize, page * pageSize]).then(rows => {
        const response = {
          body: rows,
          status: 200,
          headers: { totalRecords: count, currentPage: `${page + 1}` }
        }
        return response;
      });
    });
  }

  /**
   * This POST does not really inserts a new entry. Instead it updates all the entries of the current feed
   * @param {*} req 
   */
  create(req) {
    const feedId = req.query.feedId;
    const query = 'select url from feeds where id = $1';
    const linkFilter = [];
    const linkMap = {};
    return DB.query(query, [feedId]).then((rows) => {
      const feed = rows[0];
      return FeedUtil.parseEntries(feed.url).then((entries) => {
        entries.forEach((entry) => {
          linkFilter.push(entry.link);
          linkMap[entry.link] = entry;
        });

        const filter = { 'feed': feed._id, 'link': { $in: linkFilter } };
        return DB.query('select link from entries where feed_id = $1', [feedId]);
      }).then(existing => {
        existing.forEach((ex) => {
          delete linkMap[ex.link];
        });

        const newEntries = [];
        let key, entry;
        for (key in linkMap) {
          if (linkMap.hasOwnProperty(key)) {
            entry = linkMap[key];
            newEntries.push({
              title: entry.title,
              description: entry.description,
              link: entry.link,
              unread: true,
              starred: false,
              pubDate: entry.pubdate,
              image: entry.image.url,
              summary: entry.summary,
              feed: feed._id
            });
          }
        }

        if (newEntries.length) {
          const insertQuery = `insert into entries (title, description, link, unread, starred, pubDate, image, summary, feed_id) 
                               select * from unnest($1::text[], $2::text[], $3::text[], $4::boolean[], $5::boolean[], $6::timestamp[], $7::text[], $8::text[], $9::int[])`;
          const values = [[], [], [], [], [], [], [], [], []];
          newEntries.forEach(entry => {
            values[0].push(entry.title);
            values[1].push(entry.description);
            values[2].push(entry.link);
            values[3].push(true);
            values[4].push(false);
            values[5].push(entry.pubDate);
            values[6].push(entry.image);
            values[7].push(entry.summary);
            values[8].push(feedId);
          });

          return DB.query(insertQuery, values);
        }
        return "OK";
      })
    });
  }
}

module.exports = frontController(new EntriesController());