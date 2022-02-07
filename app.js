//dwOEbH4a06TpQSS3

const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const ejs = require('ejs');
const uri = `mongodb+srv://restApi:dwOEbH4a06TpQSS3@cluster0.1y9bx.mongodb.net/<dbname>?retryWrites=true&w=majority`

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

const articleSchema = {
    title: String,
    content: String
};
const Article = mongoose.model("Article", articleSchema)

app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            }
            else {
                res.send(err)
            }

        })
    })

    .post(function (req, res) {
        console.log(req.body.title);
        console.log(req.body.content);
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send("successfully added a new article")
            }
            else {
                res.send(err)
            }
        });
    })

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Sucessfully deleted all articles");
            }
            else {
                res.send(err)
            }
        })
    });

///////////////////////////////////

app.route("/articles/:articleTitle")
    .get(function (req, res) {

        Article.findOne({ title: req.params.articleTitle }, function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles)
            }
            else {
                res.send(err)
            }
        })
    })
    .put(function (req, res) {

        const articleTitle = req.params.articleTitle;

        Article.updateOne(
            { title: articleTitle },
            { title: req.body.title, content: req.body.content },
            function (err) {
                if (!err) {
                    res.send("Successfully updated the content of the selected article.");
                } else {
                    res.send(err);
                }
            });

    })
    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("this article id deleted");
                }
                else {
                    res.send(err);
                }
            }
        )
    });






let port = process.env.PORT;
if (port == "" || port == null) {
    port = 3000
}
app.listen(port, function () {
    console.log("server started on " + port)
})