if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

function list(unaccomplishedOnly = false, searchText = '', start)
{
    const where = [];

    if(unaccomplishedOnly) where.push(`doneTs = 0`);
    if(searchText) where.push(`text ILIKE '%$1:value%'`);
    if(start) where.push('id < $2');
    

    const sql = `
        SELECT * FROM todos
        ${where.length ? 'WHERE ' + where.join(' AND ') + '' : ''} --看不太懂??
        ORDER BY id DESC
        LIMIT 20  
    `;

    return db.any(sql, [searchText, start]);
}

//same as posts.js
function create(mood, text)
{
    const sql = `
    INSERT INTO todos ($<this:name>)
    VALUES ($<mood>, $<text>) -- insert into its property
    RETURNING * -- return all columns
    `;
    return db.one(sql, {mood, text});
}


function accomplish(id)
{
    const sql = `
    UPDATE todos
    SET done = TRUE -- set to accomplished
    WHERE id = $1;

    UPDATE todos
    SET doneTs = extract(epoch from now()) -- set the finish time
    WHERE id = $1;
    `;

    return db.any(sql, [id]);  //no need to return accomplished post
}

module.exports = {
    list,
    create,
    accomplish
};

