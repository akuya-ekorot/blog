const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const url = "mongodb://localhost:27017/blogsDB";

mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true });

const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const startingContentSchema = new mongoose.Schema({
  name: String,
  content: String,
});

const Blog = mongoose.model("Blog", blogSchema);
const StartingContent = mongoose.model(
  "StartingContent",
  startingContentSchema
);

app.get("/", (req, res) => {
  StartingContent.findOne({ name: "homeStartingContent" }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      Blog.find((err, blogs) => {
        if (err) {
          console.log(err);
        } else {
          res.render("home", {
            homeStartingContent: doc.content,
            blogs: blogs,
          });
        }
      });
    }
  });
});

app.get("/about", (req, res) => {
  StartingContent.findOne({ name: "aboutContent" }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.render("about", { aboutContent: doc.content });
    }
  });
});

app.get("/contact", (req, res) => {
  StartingContent.findOne({ name: "contactContent" }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.render("contact", { contactContent: doc.content });
    }
  });
});

app.get("/compose", (req, res) => {
  res.render("compose");
});

app.get("/posts/:title", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.title);

  Blog.find((err, blogs) => {
    if (err) {
      console.log(err);
    } else {
      blogs.forEach((blog) => {
        const storedTitle = _.lowerCase(blog.title);
        if (requestedTitle === storedTitle) {
          res.render("post", { blog: blog });
        } else {
          console.log("No match found");
        }
      });
    }
  });
});

app.post("/compose", (req, res) => {
  const blogPost = {
    title: req.body.title,
    body: req.body.body,
  };

  Blog.create(blogPost, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Succesfully added blog post to database");
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
