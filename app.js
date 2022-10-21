//jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const { Schema } = mongoose;

const articleSchema = new Schema({
  title: String,
  content: String,
});

const Article = mongoose.model("Article", articleSchema);

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static("public"));

///////////////// REQUESTS TARGETTING ALL ARTICLES /////////////////
app
  .route("/articles")
  .get((req, res) => {
    Article.find({}, (err, results) => {
      if (!err) {
        res.send(results);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save((err) => {
      if (!err) {
        res.send("successfully added data");
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    Article.deleteMany({}, (err) => {
      if (!err) {
        res.send("deleted all data");
      } else {
        res.send(err);
      }
    });
  });

///////////////// REQUESTS TARGETTING A SPECIFIC ARTICLE /////////////////
app
  .route("/articles/:articleName")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleName }, (err, result) => {
      if (!err) {
        if (!result) {
          res.send("No such article!");
        } else {
          res.send(result);
        }
      } else {
        res.send(err);
      }
    });
  })
  .put((req, res) => {
    Article.replaceOne(
      { title: req.params.articleName },
      { title: req.body.title, content: req.body.content },
      (err, result) => {
        if (!err) {
          res.send("successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleName },
      { title: req.body.title, content: req.body.content },
      (err, result) => {
        if (!err) {
          res.send("successfully updated article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteOne({ title: req.params.articleName }, (err) => {
      if (!err) {
        res.send("succesffully deleted article");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
