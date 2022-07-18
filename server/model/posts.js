if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

function list(searchText = '', start) {
    const where = [];
    if (searchText)
        where.push(`text ILIKE '%$1:value%'`);
    if (start)
        where.push('id < $2');
    const sql = `
        SELECT *
        FROM posts
        ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
        ORDER BY id DESC
        LIMIT 10
    `;
    return db.any(sql, [searchText, start]);
}

////
function listMyPost(searchText, auth_email, start){
    const where = [];
    if (searchText)
        where.push(`text ILIKE '%$1:value%'`);
    if (start)
        where.push('id < $2');
    const sql = `
        SELECT *
        FROM posts
        WHERE $2 = auth_email ${where.length ? 'AND' + where.join(' AND ') : ''}
        ORDER BY id DESC
        LIMIT 10
    `;
    return db.any(sql, [searchText, auth_email, start]);
}



function create(postData, auth_email) {
    let name = postData['name']
    let phonenumber = postData['phoneNumber']
    let store = postData['store']
    let date = postData['date']
    let fee = postData['fee']
    let text = postData['text']
    let place = postData['place']
    let gettime = postData['gettime']
    const sql = `
        INSERT INTO posts ($<this:name>)
        VALUES ($<name>, $<phonenumber>, $<store>, $<date>, $<fee>, $<text>, $<place>, $<gettime>, $<auth_email>)
        RETURNING *
    `;
    return db.one(sql, {name, phonenumber, store, date, fee, text, place, gettime,  auth_email});
}



module.exports = {
    list,
    create,
    listMyPost
};
