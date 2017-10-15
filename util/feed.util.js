const FeedParser = require('feedparser');
const request = require('request');

const parseFeed = (feedUrl, event, onReadable, onError) => {
  const feedParser = new FeedParser();

  const req = request(feedUrl, (error) => {
    if (error && onError) {
      onError(error);
    }
  });

  req.on('response', function(res) {
    const stream = this;

    if (res.statusCode !== 200) {
      return this.emit('error', new Error('Not OK'));
    }

    stream.pipe(feedParser);
  });

  feedParser.on('error', (e) => {
    if (onError) {
      onError(e);
    }
  });

  feedParser.on(event, onReadable);
  return feedParser;
};

const parseImage = (entry) => {
  if (!entry.image.url) {

    //try to find enclosures first:
    if (entry.enclosures && entry.enclosures.length) {
      entry.enclosures.forEach((enclosure) => {
        if (enclosure.type.indexOf('image') >= 0) {
          entry.image.url = enclosure.url;
        }
      });
    }

    //if image is still not found, finds the first one in the post:
    if (!entry.image.url) {
      const firstImg = entry.description.match(/<img.+?src\s*=\s*(".+?"|'.+?')/);
      if (firstImg) {
        entry.image.url = firstImg[1].replace(/"|'/g, '');
      }
    }
  }
  return entry;
};

const parseSummary = (entry) => {
  if (entry.summary) {
    //removes images, links and all tags:
    entry.summary = entry.summary
      .replace(/<img.+?>/, '')
      .replace(/<a.+?\/a>/, '')
      .replace(/(<([^>]+)>)/ig, "");
  }
  return entry;
};

class FeedUtil {
  static parseFeedMeta(feedUrl) {
    return new Promise((resolve, reject) => {
      parseFeed(feedUrl, 'meta', (meta) => {
        resolve({
          url: feedUrl,
          title: meta.title,
          description: meta.description,
          link: meta.link,
          failedUpdate: false
        });
      }, reject);
    })
  }

  static parseEntries(feedUrl) {
    return new Promise((resolve, reject) => {
      const items = [];
      const parser = parseFeed(feedUrl, 'readable', function () {
        const stream = this;
        let item;
        while (item = stream.read()) {
          parseImage(item);
          parseSummary(item);
          items.push(item);
        }
      }, reject);

      parser.on('end', function () {
        resolve(items);
      });
    });
  }
}


module.exports = FeedUtil;