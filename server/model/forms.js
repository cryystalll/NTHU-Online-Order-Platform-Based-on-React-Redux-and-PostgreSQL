if (!global.db) {
    const pgp = require('pg-promise')();
    db = pgp(process.env.DB_URL);
}

//const postModel = require('./posts.js');


////Listing myForm
function listForm(id, auth_email, role){

    const sql = `
    SELECT *
    FROM forms
    ${(role==='poster')?"WHERE $1 = id":"WHERE $2 = auth_email AND $1 = id"}
    `;
    return db.any(sql, [id, auth_email, role]); ////why[]? somehow it will work???
}


////Creating form
function createForm(id, name, phone, drink, cups, money, comment, sugar, ice, auth_email){
    console.log(phone);
    console.log(sugar);
    console.log(ice);
    const sql = `
        INSERT INTO forms (id, name, phone, drink, cups, money, comment, sugar, ice, auth_email)
        VALUES ($<id>, $<name>, $<phone>, $<drink>, $<cups>, $<money>, $<comment>, $<sugar>, $<ice>, $<auth_email>)
        RETURNING *
    `;
    return db.one(sql, {id, name, phone, drink, cups, money, comment, sugar, ice, auth_email});
}

////Get emails forms of the post
function listEmail(postid){
    const sql = `
    SELECT * FROM forms 
    WHERE $1 = id
    `;
    return db.any(sql, [postid]);
}
////To make change with checked form(UPDATE check)
////sql UPDATE

// INSERT INTO forms ("check")
//         VALUE ($2)
//         WHERE $1 = formid

////error code but work???
function updateCheck(formid, check){
    const sql = `
        UPDATE forms SET "check" = $2 
        WHERE $1 = formid
    `;
    return db.one(sql, [formid, check])
}

module.exports = {
    createForm,
    listForm,
    listEmail,
    updateCheck
}
