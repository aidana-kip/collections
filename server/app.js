const express = require("express");
const pool = require("./utils/db");
const cors = require("cors");
const userController = require("./controllers/user-controller");
const collectionController = require("./controllers/collection-controller");
const itemController = require("./controllers/item-controller");
const commentController = require("./controllers/comments-controller");
const authController = require("./controllers/auth-controller");
const userValidator = require("./validators/user-validator");
const itemValidator = require("./validators/item-validator");
const commentValidator = require("./validators/comment-validator");
const app = express();
const port = 8080;
app.use(express.json());
app.use(cors());

// Users API
app.post(
  "/users/sign-up",
  userValidator.signUpValidators,
  userController.signUp
);
app.get("/users", userController.getAllUsers);
app.post(
  "/users/sign-in",
  userValidator.signInValidators,
  userController.login
);
app.get(
  "/users/block/:id",
  authController.authenticateUser,
  userController.blockUsers
);
app.get(
  "/users/unblock/:id",
  authController.authenticateUser,
  userController.unblockUsers
);
app.delete(
  "/users/:id",
  authController.authenticateUser,
  userController.deleteUsers
);
app.put(
  "/users/:id/admin",
  authController.authenticateUser,
  userController.makeAdmin
);
app.put(
  "/users/:id/user",
  authController.authenticateUser,
  userController.makeUser
);

// Collections API
app.get("/collections", collectionController.getAllCollections);
app.get("/collections/:id", collectionController.getCollectionsById);
app.get(
  "/collections/by-user/:id",
  collectionController.getCollectionsByUserId
);
app.post(
  "/collections",
  authController.authenticateUser,
  collectionController.addCollections
);
app.put(
  "/collections/:id",
  authController.authenticateUser,
  collectionController.editCollections
);
app.delete(
  "/collections/:id",
  authController.authenticateUser,
  collectionController.deleteCollections
);
app.post(
  "/collections/search",
  authController.authenticateUser,
  collectionController.searchCollections
);

// Items API
app.get("/items", itemController.getAllItems);
app.get("/items/:id", itemController.getItemById);
app.get("/items/by-user/:userId", itemController.getItemsByUserId);
app.get(
  "/items/by-collection/:collectionId",
  itemController.getItemsByCollectionId
);
app.post(
  "/items",
  authController.authenticateUser,
  itemValidator.createItemValidator,
  itemController.addItem
);
app.put("/items/:id", authController.authenticateUser, itemController.editItem);
app.delete(
  "/items/:id",
  authController.authenticateUser,
  itemController.deleteItem
);
app.post(
  "/items/search",
  authController.authenticateUser,
  itemController.searchItems
);

// Comments API
app.post(
  "/comments",
  authController.authenticateUser,
  commentValidator.createCommentValidator,
  commentController.addComment
);
app.get("/comments/by-item/:itemId", commentController.getAllCommentsByItemId);
app.delete(
  "/comments/:id",
  authController.authenticateUser,
  commentController.deleteComment
);

// Starting server
app.listen(port, () => {
  console.log(`Final project app listening on port ${port}`);
});
