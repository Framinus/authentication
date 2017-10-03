
const pgp = require('pg-promise')();

const cn = {
  host: 'localhost',
  port: 5432,
  database: 'users'
};

const db = pgp(cn);

const addUser = function (name, email, password) {
  db.one(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;', [name, email, password])
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err, `input not successfully entered into database`);
    });
}

const findUser = function (email) {
  return db.query(
    'SELECT * FROM users WHERE email=$1', email)
    .then(data => {
      return data;
    })
    .catch(err => {
      console.log(err, 'user not found');
    })
}

module.exports = { addUser, findUser };
