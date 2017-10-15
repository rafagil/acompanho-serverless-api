-- Feeds table:
create table feeds (
	id serial,
  title varchar,
  description text,
	link varchar,
	url varchar,
	failedUpdate boolean,
	user_id bigint,
	category_id bigint
);
create table entries (
	id serial,
  title varchar,
  description varchar,
  link varchar,
  unread boolean,
	starred boolean, 
	pubDate timestamp,
	image varchar, 
	summary text,
	feed_id bigint
);
          