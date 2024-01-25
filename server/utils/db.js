const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "final-project.cjtqhtipdyak.us-east-1.rds.amazonaws.com",
  database: "final_project",
  password: "postgres",
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;
