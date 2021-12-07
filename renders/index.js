const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    try {
      res.render("index");
    } catch (error) {
      res.render("error");
    }
  });

  router.get("/login", (req, res, next) => {
    try {
      res.render("login");
    } catch (error) {
      res.render("error");
    }
  });
  
  router.get("/sign_up", (req, res, next) => {
    try {
      res.render("sign_up");
    } catch (error) {
      res.render("error");
    }
  });
  
  router.get("/create", (req, res, next) => {
    try {
      res.render("create");
    } catch (error) {
      res.render("error");
    }
  });




module.exports = router;