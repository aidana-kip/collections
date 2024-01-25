const pool = require("../utils/db");
const constants = require("../utils/app-constants");
const { validationResult } = require("express-validator");
const { getPageData } = require("../utils/pagination");

const getAllCollections = (req, res) => {
  const pageData = getPageData(req);
  const queryString =
    "select * from collections order by :orderBy limit :limit offset :offset"
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

const getCollectionsById = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    "SELECT * FROM collections WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
        return;
      }

      if (results.rowCount > 0) {
        pool.query(
          "select * from items where collection_id = $1",
          [id],
          (getItemsErr, getItemsResults) => {
            if (getItemsErr) {
              res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
              return;
            }

            let collection = results.rows[0];
            collection.items = getItemsResults.rows;

            res.status(200).send(collection);
          }
        );
      } else {
        res
          .status(400)
          .send(
            constants.COLLECTION_NOT_FOUND_RESPONSE.replace("$collectionId", id)
          );
      }
    }
  );
};

const getCollectionsByUserId = (req, res) => {
  const pageData = getPageData(req);
  const userId = parseInt(req.params.id);
  const queryString =
    "SELECT * FROM collections WHERE user_id=$1 ORDER BY :orderBy limit :limit offset :offset"
      .replace(":orderBy", pageData.orderBy)
      .replace(":limit", pageData.limit)
      .replace(":offset", pageData.offset);
  pool.query(queryString, [userId], (error, results) => {
    if (error) {
      res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
      return;
    }

    res.status(200).json(results.rows);
  });
};

const addCollection = (req, res) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    res.status(400).send({ errors: validationErrors.array() });
    return;
  }

  if (!req.user || !req.user.userId) {
    res.status(403).send({ error: constants.NOT_ENOUGH_PERMISSION_RESPONSE });
    return;
  }

  let { name, description, topic } = req.body;
  pool.query(
    "INSERT INTO collections (name, description, topic, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, description, topic, req.user.userId],
    (error, results) => {
      if (error) {
        res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
        return;
      }

      res.status(201).send(results.rows[0]);
    }
  );
};

const editCollections = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    "select * from collections where id = $1",
    [id],
    (selectQueryError, selectQueryResult) => {
      if (selectQueryError) {
        res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
        return;
      }

      if (selectQueryResult.rows.length === 0) {
        res.status(400).send({
          error: constants.COLLECTION_NOT_FOUND_RESPONSE.replace(
            "$collectionId",
            id
          ),
        });
        return;
      }

      let collection = selectQueryResult.rows[0];

      if (!req.user || !req.user.userId) {
        res
          .status(403)
          .send({ error: constants.NOT_ENOUGH_PERMISSION_RESPONSE });
        return;
      }

      if (req.user.userId == collection.user_id || req.user.role === "admin") {
        let { name, description, topic } = req.body;
        pool.query(
          "UPDATE collections SET name=$1, description=$2, topic=$3 WHERE id=$4 returning *",
          [name, description, topic, id],
          (error, results) => {
            if (error) {
              res.status(500).send(constants.INTERNAL_SERVER_ERROR_RESPONSE);
              return;
            }

            res.status(200).send(results.rows[0]);
          }
        );
      } else {
        res.status(403).send(constants.NOT_ENOUGH_PERMISSION_RESPONSE);
      }
    }
  );
};

const deleteCollections = (req, res) => {
  const id = parseInt(req.params.id);
  pool.query(
    "select * from collections where id = $1",
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
          error: constants.COLLECTION_NOT_FOUND_RESPONSE.replace(
            "$collectionId",
            id
          ),
        });
        return;
      }

      let collection = selectQueryResult.rows[0];

      if (req.user.userId === collection.user_id || req.user.role === "admin") {
        pool.query(
          "delete from item_comments where item_id in (select id from items where collection_id = $1)",
          [id]
        );
        pool.query("delete from items where collection_id = $1", [id]);
        pool.query(
          "DELETE FROM collections WHERE id = $1",
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

const searchCollections = (req, res) => {
  if (!req.user) {
    res.status(401).send();
    return;
  }

  pool.query(
    "select * from collections where name like $1 ",
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
  getAllCollections,
  getCollectionsById,
  getCollectionsByUserId,
  addCollections: addCollection,
  editCollections,
  deleteCollections,
  searchCollections,
};
