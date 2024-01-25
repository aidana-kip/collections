create table users(
    id bigserial primary key,
    email varchar(255) not null unique,
    first_name varchar(155) not null,
    last_name varchar(155),
    password varchar(255) not null,
    role varchar(11) not null default 'user',
    status varchar(11) not null default 'active',
    created_at timestamp not null default CURRENT_TIMESTAMP
);

create table collections(
    id bigserial primary key,
    name varchar(155) not null,
    description varchar(255),
    topic varchar(155) not null,
    user_id bigint references users(id) not null,
    created_at timestamp not null default CURRENT_TIMESTAMP
);

create table items(
    id bigserial primary key,
    name varchar(155) not null,
    tag varchar(255),
    collection_id bigint references collections(id) not null,
    user_id bigint references users(id) not null,
    created_at timestamp not null default CURRENT_TIMESTAMP
);

create table item_comments(
    id bigserial primary key,
    comment varchar(255) not null,
    item_id bigint references items(id) not null,
    user_id bigint references users(id) not null,
    created_at timestamp not null default CURRENT_TIMESTAMP
);