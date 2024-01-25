const pool = require("../utils/db");
const constants = require("../utils/app-constants");
const { validationResult } = require("express-validator");

const addComment = (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    res.status(400).send({ errors: validationErrors.array() });
    return;
  }

  if (!req.user || !req.user.userId) {
    res.status(403).send({ error: constants.NOT_ENOUGH_PERMISSION_RESPONSE });
    return;
  }

  let { comment, itemId } = req.body;
  pool.query(
    "INSERT INTO item_comments (comment, item_id, user_id) VALUES ($1, $2, $3) RETURNING *",
    [comment, parseInt(itemId), req.user.userId],
    (error, results) => {
      if (error) {
        res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
        return;
      }

      res.status(201).send(results.rows[0]);
    }
  );
};

const getAllCommentsByItemId = (req, res) => {
  const itemId = parseInt(req.params.itemId);
  pool.query(
    "SELECT * FROM item_comments WHERE item_id = $1",
    [itemId],
    (error, results) => {
      if (error) {
        res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
        return;
      }

      res.status(200).send(results.rows);
    }
  );
};

const deleteComment = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    "select * from item_comments where id = $1",
    [id],
    (selectQueryError, selectQueryResult) => {
      if (selectQueryError) {
        res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
        return;
      }

      if (!req.user || !req.user.userId) {
        res
          .status(403)
          .send({ error: constants.NOT_ENOUGH_PERMISSION_RESPONSE });
        return;
      }

      if (selectQueryResult.rows.length === 0) {
        res.status(400).send({
          error: constants.COMMENT_NOT_FOUND_RESPONSE.replace("$commentId", id),
        });
        return;
      }

      let comment = selectQueryResult.rows[0];
      if (req.user.userId === comment.user_id || req.user.role === "admin") {
        pool.query(
          "DELETE FROM item_comments WHERE id = $1",
          [id],
          (deleteQueryError) => {
            if (deleteQueryError) {
              res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
              return;
            }

            res.status(204).send();
          }
        );
      } else {
        res
          .status(403)
          .send({ error: constants.NOT_ENOUGH_PERMISSION_RESPONSE });
      }
    }
  );
};

module.exports = { addComment, getAllCommentsByItemId, deleteComment };
