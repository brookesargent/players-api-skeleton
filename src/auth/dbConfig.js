require('dotenv').config();
module.exports = {
  'secret': process.env.secret,
  'database': process.env.db
};