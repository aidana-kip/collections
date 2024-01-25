var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../utils/db");
const constants = require("../utils/app-constants");
const { validationResult } = require("express-validator");
const { getPageData } = require("../utils/pagination");

const signUp = async (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    res.status(400).send({ errors: validationErrors.array() });
    return;
  }

  let { firstName, lastName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  pool.query(
    "SELECT * FROM users WHERE email=$1",
    [email],
    (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: constants.INTERNAL_SERVER_ERROR_RESPONSE });
        return;
      }

      if (results.rows.length > 0) {
        res.status(400).send({ error: constants.USER_ALREADY_EXIST_RESPONSE });
      } else {
        pool.query(
          "INSERT INTO users (email, first_name, last_name, password) VALUES ($1, $2, $3, $4) RETURNING *",
          [
            email,
            firstName,
            lastName !== undefined ? lastName : null,
            hashedPassword,
          ],
          (error, results) => {
            if (error) {
              res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
            } else {
              res.status(201).send(results.rows[0]);
            }
          }
        );
      }
    }
  );
};

const getAllUsers = (req, res) => {
  const pageData = getPageData(req);
  const stringQuery =
    "SELECT * FROM users ORDER BY :orderBy limit :limit offset :offset"
      .replace(":orderBy", pageData.orderBy)
      .replace(":limit", pageData.limit)
      .replace(":offset", pageData.offset);

  pool.query(stringQuery, (error, results) => {
    if (error) {
      res.status(500).send({ error: constants.INTERNAL_SERVER_ERROR_RESPONSE });
      return;
    }

    res.send(results.rows);
  });
};

const login = (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    res.status(400).send({ errors: validationErrors.array() });
    return;
  }

  let { email, password } = req.body;
  pool.query(
    "SELECT * FROM users WHERE email=$1 AND status = 'active'",
    [email],
    (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: constants.INTERNAL_SERVER_ERROR_RESPONSE });
        return;
      }

      if (results.rows.length > 0) {
        let user = results.rows[0];
        bcrypt.compare(password, user.password).then((matchingResult) => {
          if (matchingResult) {
            const token = jwt.sign(
              {
                id: user.id,
                role: user.role,
              },
              "testKey",
              { expiresIn: "1h" }
            );
            res.status(200).send({ token: token, user: user });
          } else {
            res.status(401).send();
          }
        });
      } else {
        res.status(401).send();
      }
    }
  );
};

const blockUser = (req, res) => {
  if (req.user === undefined || req.user.role === undefined) {
    res.status(401).send({ error: "Unauthorized" });
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).send({ error: constants.ONLY_ADMIN_OPERATION_RESPONSE });
    return;
  }

  const id = parseInt(req.params.id);
  pool.query(
    "UPDATE users SET status = 'blocked' WHERE id = $1 returning *",
    [id],
    (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: constants.INTERNAL_SERVER_ERROR_RESPONSE });
        return;
      }

      if (results.rows.length === 0) {
        res.status(400).send({
          error: constants.USER_DOES_NOT_EXIST_RESPONSE.replace(":id", id),
        });
      } else {
        res.status(200).send("User blocked!");
      }
    }
  );
};

const unblockUsers = (req, res) => {
  if (req.user === undefined || req.user.role === undefined) {
    res.status(401).send();
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).send({ error: constants.ONLY_ADMIN_OPERATION_RESPONSE });
    return;
  }

  const id = parseInt(req.params.id);
  pool.query(
    "UPDATE users SET status = 'active' WHERE id = $1 returning *",
    [id],
    (error, results) => {
      if (error) {
        res
          .status(500)
          .send({ error: constants.INTERNAL_SERVER_ERROR_RESPONSE });
        return;
      }

      if (results.rows.length === 0) {
        res.status(400).send({
          error: constants.USER_DOES_NOT_EXIST_RESPONSE.replace(":id", id),
        });
      } else {
        res.status(200).send("User unblocked!");
      }
    }
  );
};

const deleteUsers = (req, res) => {
  if (req.user === undefined || req.user.role === undefined) {
    res.status(401).send();
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).send({ error: constants.ONLY_ADMIN_OPERATION_RESPONSE });
    return;
  }

  const id = parseInt(req.params.id);
  pool.query(
    "delete from comments where user_id=$1",
    [id],
    (commentsQueryErr, commentsQueryRes) => {
      pool.query(
        "delete from items where user_id=$1",
        [id],
        (itemsQueryErr, itemsQueryRes) => {
          pool.query(
            "delete from collections where user_id=$1",
            [id],
            (collectionsQueryErr, collectionsQueryRes) => {
              pool.query(
                "DELETE FROM users WHERE id = $1 returning *",
                [id],
                (error, results) => {
                  if (error) {
                    res.status(500).send({
                      error: constants.INTERNAL_SERVER_ERROR_RESPONSE,
                    });
                    return;
                  }

                  res.status(204).send();
                }
              );
            }
          );
        }
      );
    }
  );
};

const makeAdmin = (req, res) => {
  if (req.user === undefined || req.user.role === undefined) {
    res.status(401).send();
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).send({ error: constants.ONLY_ADMIN_OPERATION_RESPONSE });
    return;
  }

  const id = parseInt(req.params.id);
  pool.query(
    "update users set role='admin' where id = $1 returning *",
    [id],
    (error, result) => {
      if (error) {
        res
          .status(500)
          .send({ error: constants.INTERNAL_SERVER_ERROR_RESPONSE });
        return;
      }

      if (result.rows.length === 0) {
        res.status(400).send({
          error: constants.USER_DOES_NOT_EXIST_RESPONSE.replace(":id", id),
        });
      } else {
        res.status(200).send(result.rows[0]);
      }
    }
  );
};

const makeUser = (req, res) => {
  if (req.user === undefined || req.user.role === undefined) {
    res.status(401).send();
    return;
  }

  if (req.user.role !== "admin") {
    res.status(403).send({ error: constants.ONLY_ADMIN_OPERATION_RESPONSE });
    return;
  }

  const id = parseInt(req.params.id);
  pool.query(
    "update users set role='user' where id = $1 returning *",
    [id],
    (error, result) => {
      if (error) {
        res
          .status(500)
          .send({ error: constants.INTERNAL_SERVER_ERROR_RESPONSE });
        return;
      }

      if (result.rows.length === 0) {
        res.status(400).send({
          error: constants.USER_DOES_NOT_EXIST_RESPONSE.replace(":id", id),
        });
      } else {
        res.status(200).send(result.rows[0]);
      }
    }
  );
};

module.exports = {
  signUp,
  getAllUsers,
  login,
  blockUsers: blockUser,
  unblockUsers,
  deleteUsers,
  makeAdmin,
  makeUser,
};
