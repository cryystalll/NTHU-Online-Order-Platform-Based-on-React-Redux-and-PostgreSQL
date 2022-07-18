require('../../config.js');
const pgp = require('pg-promise')();
const db = pgp(process.env.DB_URL);

const schemaSql = `
    -- Extensions
    CREATE EXTENSION IF NOT EXISTS pg_trgm;

    -- Drop (droppable only when no dependency)
    DROP INDEX IF EXISTS posts_idx_text;
    DROP INDEX IF EXISTS posts_idx_ts;
    DROP TABLE IF EXISTS posts;
    DROP TYPE IF EXISTS mood CASCADE;

    ------
    DROP TABLE IF EXISTS todos;
    DROP INDEX IF EXISTS todos_idx_text;
    DROP INDEX IF EXISTS todos_idx_ts;
    
    ------
    DROP TABLE IF EXISTS forms;


    -- Create
    CREATE TYPE mood AS ENUM (
        'Clear',
        'Clouds',
        'Drizzle',
        'Rain',
        'Thunder',
        'Snow',
        'Windy'
    );

    
    CREATE TABLE posts (
        id              serial PRIMARY KEY NOT NULL,
        name            text NOT NULL, 
        phonenumber     text NOT NULL, 
        store           text NOT NULL, 
        date            text NOT NULL,  
        place           text NOT NULL,
        gettime         text NOT NULL,
        fee             text NOT NULL, 
        text            text NOT NULL,
        auth_email      text NOT NULL,
        ts              bigint NOT NULL DEFAULT (extract(epoch from now()))
    );
    
    CREATE TABLE todos (
        id          serial PRIMARY KEY NOT NULL,
        mood        mood NOT NULL,
        text        text NOT NULL,
        ts          bigint NOT NULL DEFAULT(extract (epoch from now())),
        doneTs      bigint NOT NULL DEFAULT 0,
        done        boolean DEFAULT FALSE
    );

    ------Form table

    CREATE TABLE forms (
        id          integer NOT NULL,
        name        text NOT NULL,    
        phone       text NOT NULL,
        drink       text NOT NULL,
        cups        text NOT NULL,
        money       text NOT NULL,
        comment     text NOT NULL DEFAULT NULL,
        sugar       integer NOT NULL,
        ice         integer NOT NULL,
        auth_email  text NOT NULL DEFAULT NULL,
        "like"      boolean DEFAULT FALSE,  ---- like is reserved word in sql
        ts          bigint NOT NULL DEFAULT (extract(epoch from now())),
        formid      serial PRIMARY KEY NOT NULL,
        "check"     boolean DEFAULT FALSE
    );
    
    CREATE INDEX posts_idx_ts ON posts USING btree(ts);
    CREATE INDEX posts_idx_text ON posts USING gin(text gin_trgm_ops);
    ------
    CREATE INDEX todos_idx_ts ON todos USING btree(ts);
    CREATE INDEX todos_idx_text ON todos USING gin(text gin_trgm_ops);
    ------

`;

// -- Populate dummy posts
//     INSERT INTO posts (store, fee, ts)
//     SELECT
//         'beveragestore' || (i),
//         '100 USD',
//         round(extract(epoch from now()) + (i - 1000000) * 3600.0)
//     FROM generate_series(1, 1000) AS s(i);

const dataSql = `
    -- Populate dummy post into todos
    INSERT INTO todos (mood, text, ts)
    SELECT
        'Drizzle',
        'the ' || i || '-post',
        round(extract(epoch from now()) + (i - 10000) * 3600.0)
    FROM generate_series(1, 10000) AS s(i);

`;

db.none(schemaSql).then(() => {
    console.log('Schema created');
    db.none(dataSql).then(() => {
        console.log('Data populated');
        pgp.end();
    });
}).catch(err => {
    console.log('Error creating schema', err);
});
