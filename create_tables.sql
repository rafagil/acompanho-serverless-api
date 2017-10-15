-- Feeds table:
create table feeds (
  title varchar,
  description text,
	link varchar,
	url varchar,
	failedUpdate bool,
	user_id bigint,
	category_id bigint
)