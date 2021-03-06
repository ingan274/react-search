const db = require("../models");
const axios = require("axios")
const dotenv = require("dotenv");
dotenv.config({ path: '../env' });

// Defining methods for the articlsController
module.exports = {

    // findAllGoogle searches the NYT API and returns only the entries we haven't already saved
    findAllGoogle: function (req, res) {
        const search = req.params.query
        const url = "https://newsapi.org/v2/everything?q=" + search + "&apiKey=" + process.env.APIKEY;
        // console.log(url)
        axios
            .get(url)
            .then((articles) => {
                res.json(articles.data)
                // console.log(articles)
            })
            .catch(err => {
                res.status(422);
                console.log(err)
            });
    },
    findAllArticles: function (req, res) {
        db.Article
            .find()
            .sort({ '_id': -1 })
            .then(dbModel => res.json(dbModel))
            .catch(err => {
                res.status(422)
                console.log("all saved",err)
            });
    },

    create: function (req, res) {
        const article = {
            title: req.body.title,
            url: req.body.url,
            description: req.body.description,
            author: req.body.author
        };
        db.Article
            .create(article)
            .then(dbArticle => res.json(dbArticle))
            .catch(err => {
                res.status(422)
                console.log("create saved",err)
            });
    },
    update: function (req, res) {
        db.Article
            .findOneAndUpdate({ _id: req.params.search }, req.body)
            .then(dbArticle => {
                console.log(dbArticle)
                res.json(dbArticle)
            })
            .catch(err => {
                res.status(422)
                console.log("update saved",err)
            });
    },
    remove: function (req, res) {
        db.Article
            .deleteOne({ _id: req.params.search })
            .then(dbArticle => res.json(dbArticle))
            .catch(err => {
                res.status(422)
                console.log("delete saved error",err)
            });
    }
};