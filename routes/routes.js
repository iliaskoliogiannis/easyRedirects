const express = require("express");
const route = express.Router();
const UploadController = require("../controllers/UploadController");

route.get("/", UploadController.index);
route.post("/", UploadController.upload, UploadController.create);

module.exports = route;