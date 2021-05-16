const express = require("express");
const router = express.Router();

const UserService = require("../controllers/UserService");

router.get("/all", UserService.getAllUsers);

router.get("/:username", UserService.getUserByUsername);

router.post("/", UserService.createUser);

router.post("/register", UserService.register);

router.post("/auth", UserService.authUser);

router.delete("/:username", UserService.deleteUser);

router.put("/:username", UserService.updateUser);

module.exports = function (server) {
    server.use("/users", router);
};
