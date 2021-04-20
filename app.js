//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article", articleSchema);

//using express routing handler to reduce code
////////////////////Requests Targetting A All Articles////////////////////
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
        //console.log(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    //console.log(req.body.title);
    //console.log(req.body.content);
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });

    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added a new article.");
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted all articles.");
      } else {
        res.send(err);
      }
    });
  });

////////////////////Requests Targetting A Specific Article//////////////////
app.route("/articles/:articleTitle")
  .get(function(req, res) {
    const requestedArticleTitle = req.params.articleTitle;

    Article.findOne({
      title: requestedArticleTitle
    }, function(err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
        //console.log(foundArticle);
      } else {
        res.send(err, "No articles matching that title was found.");
      }
    });
  })

  .put(function(req, res) {
    const articleTitle = req.params.articleTitle;
    const updateArticleTitle = req.body.title;
    const updateArticleContent = req.body.content;

    Article.updateOne({
      title: articleTitle
    }, {
      title: updateArticleTitle,
      content: updateArticleContent
    }, function(err) {
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        console.log(err);
        res.send(err, "No articles found to update the matching input.");
      }
    });
  })

  .patch(function(req, res) {
    const articleTitle = req.params.articleTitle;
    const updateArticleTitle = req.body.title;
    const updateArticleContent = req.body.content;

    Article.updateOne({
      title: articleTitle
    }, {
      $set: req.body
    }, function(err) {
      if (!err) {
        res.send("Successfully updated article.");
      } else {
        console.log(err);
        res.send(err, "No articles found to update the matching input.");
      }
    });
  })

.delete(function(req, res) {
  const articleTitle = req.params.articleTitle;

  Article.deleteOne({title: articleTitle}, function(err) {
    if (!err) {
      res.send("Successfully deleted the article.");
    } else {
      res.send(err);
    }
  });
});

//code refactoring to using the express route handler

// app.get("/articles", function(req, res) {
//   Article.find(function(err, foundArticles) {
//     if (!err) {
//       res.send(foundArticles);
//       //console.log(foundArticles);
//     } else {
//       res.send(err);
//     }
//   });
// });
//
// app.post("/articles", function(req, res) {
//   //console.log(req.body.title);
//   //console.log(req.body.content);
//   const newArticle = new Article({
//     title: req.body.title,
//     content: req.body.content
//   });
//
//   newArticle.save(function(err) {
//     if (!err) {
//       res.send("Successfully added a new article.");
//     } else {
//       res.send(err);
//     }
//   });
// });
//
// app.delete("/articles", function(req, res) {
//   Article.deleteMany(function(err) {
//     if (!err) {
//       res.send("Successfully deleted all articles.");
//     } else {
//       res.send(err);
//     }
//   });
// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
