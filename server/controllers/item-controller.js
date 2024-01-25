const pool = require("../utils/db");
const constants = require("../utils/app-constants");
const { validationResult } = require("express-validator");
const { getPageData } = require("../utils/pagination");

const getAllItems = (req, res) => {
  const pageData = getPageData(req);
  const queryString =
    "select * from items order by :orderBy limit :limit offset :offset"
      .replace(":orderBy", pageData.orderBy)
      .replace(":limit", pageData.limit)
      .replace(":offset", pageData.offset);
  pool.query(queryString, (error, results) => {
    if (error) {
      res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
      return;
    }

    res.status(200).json(results.rows);
  });
};

const getItemById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query("SELECT * FROM items WHERE id=$1", [id], (error, results) => {
    if (error) {
      res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
      return;
    }

    if (results.rowCount > 0) {
      pool.query(
        "select * from item_comments where item_id=$1",
        [id],
        (commentsQueryErr, commentsQueryRes) => {
          let item = results.rows[0];

          item.comments = commentsQueryRes.rows;
          res.status(200).send(item);
        }
      );
    } else {
      res
        .status(400)
        .send(constants.ITEM_NOT_FOUND_RESPONSE.replace("$itemId", id));
    }
  });
};

const getItemsByUserId = (req, res) => {
  const pageData = getPageData(req);
  const queryString =
    "select * from items where user_id=$1 order by :orderBy limit :limit offset :offset"
      .replace(":orderBy", pageData.orderBy)
      .replace(":limit", pageData.limit)
      .replace(":offset", pageData.offset);
  const userId = parseInt(req.params.userId);
  pool.query(queryString, [userId], (error, results) => {
    if (error) {
      res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
      return;
    }

    res.status(200).json(results.rows);
  });
};

const getItemsByCollectionId = (req, res) => {
  const pageData = getPageData(req);
  const queryString =
    "select * from items where collection_id=$1 order by :orderBy limit :limit offset :offset"
      .replace(":orderBy", pageData.orderBy)
      .replace(":limit", pageData.limit)
      .replace(":offset", pageData.offset);
  const collectionId = parseInt(req.params.collectionId);
  pool.query(queryString, [collectionId], (error, results) => {
    if (error) {
      res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
      return;
    }

    res.status(200).json(results.rows);
  });
};

const addItem = (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    res.status(400).send({ errors: validationErrors.array() });
    return;
  }

  if (!req.user || !req.user.userId) {
    res.status(403).send({ error: constants.NOT_ENOUGH_PERMISSION_RESPONSE });
    return;
  }

  let { name, tag, collectionId } = req.body;
  pool.query(
    "INSERT INTO items (name, tag, collection_id, user_id, created_at) VALUES ($1, $2, $3, $4,  CURRENT_TIMESTAMP ) RETURNING *",
    [name, tag, parseInt(collectionId), req.user.userId],
    (error, results) => {
      if (error) {
        res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
        return;
      }

      res.status(201).send(results.rows[0]);
    }
  );
};

const editItem = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    "select * from items where id = $1",
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
          error: constants.ITEM_NOT_FOUND_RESPONSE.replace("$itemId", id),
        });
        return;
      }

      let item = selectQueryResult.rows[0];

      if (req.user.userId === item.user_id || req.user.role === "admin") {
        let { name, tag } = req.body;
        pool.query(
          "UPDATE items SET name=$1, tag=$2 WHERE id=$3 returning *",
          [name, tag, id],
          (updateQueryError, updateQueryResult) => {
            if (updateQueryError) {
              res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
              return;
            }

            res.status(200).send(updateQueryResult.rows[0]);
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

const deleteItem = (req, res) => {
  const id = parseInt(req.params.id);

  pool.query(
    "delete from item_comments where item_id=$1",
    [id],
    (commentsQueryErr, commentsQueryRes) => {
      pool.query(
        "select * from items where id = $1",
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
              error: constants.ITEM_NOT_FOUND_RESPONSE.replace("$itemId", id),
            });
            return;
          }

          let item = selectQueryResult.rows[0];

          if (req.user.userId === item.user_id || req.user.role === "admin") {
            pool.query(
              "DELETE FROM items WHERE id = $1",
              [id],
              (deleteQueryError) => {
                if (deleteQueryError) {
                  res
                    .status(500)
                    .send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
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
    }
  );
};

const searchItems = (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  pool.query(
    "select * from items where name like $1",
    ["%" + req.body.searchText + "%"],
    (error, result) => {
      if (error) {
        res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
        return;
      }

      res.status(200).send(result.rows);
    }
  );
};

module.exports = {
  getAllItems,
  getItemById,
  getItemsByUserId,
  getItemsByCollectionId,
  addItem,
  editItem,
  deleteItem,
  searchItems,
};
