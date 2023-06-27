const express = require("express");
const todoRoute = express.Router();
todoRoute.use(express.json());

const { TodoModel } = require("../model/todomodel");
const { authenticate } = require("../middleware/authenticate.middleware");

//todoRoute.use(authenticate);

const { redisClient, elasticSearchClient } = require("../config/db")

todoRoute.get("/", async (req, res) => {
    try {
        const data = await TodoModel.find({ userID: req.body.userID });
        res.status(200).send({ "Todos": data });
    }
    catch (err) {
        res.status(404).send({ "error": err });
    }
})

todoRoute.post("/add", async (req, res) => {
    try {
        const data = new TodoModel({
            title: req.body.title,
            priority: req.body.priority,
            description: req.body.description == undefined ? undefined : req.body.description,
            userID: req.body.userID,
            status: req.body.status
        });
        await data.save();

        res.send({ "message": "Todo added" });
    }
    catch (err) {
        res.status(404).send({ "error": err });
    }

    const result = await elasticClient.index({
        index: "posts",
        document: {
            title: req.body.title,
            author: req.body.author,
            content: req.body.content,
        },
    });

    res.send(result);
})

todoRoute.patch("/update/:id", async (req, res) => {
    const ID = req.params.id;
    const payload = req.body;
    const data = await TodoModel.findOne({ _id: ID });
    const userid_in_req = payload.userID;
    const userid_in_doc = data.userID.toString();

    try {
        if (userid_in_req !== userid_in_doc) {
            res.status(401).send({ "message": "Oops, You're NOT Authorized" });
        }
        else {
            await TodoModel.findByIdAndUpdate({ _id: ID }, payload);
            res.send({ "message": "Todo modified in Database" });
        }
    }
    catch (err) {
        res.status(404).send({ "message": "Bad request 404" });
    }
})

todoRoute.delete("/delete/:id", async (req, res) => {
    const ID = req.params.id;
    const data = await TodoModel.findOne({ _id: ID });
    const userid_in_req = req.body.userID;

    const userid_in_doc = data.userID.toString();
    try {
        if (userid_in_req !== userid_in_doc) {
            res.status(401).send({ "message": "Oops, You're NOT Authorized" });
        }
        else {
            await TodoModel.findByIdAndDelete({ _id: ID })
            res.send({ "message": "Todo has been deleted" })
        }
    }
    catch (err) {
        res.status(404).send({ "message": "Bad request 404" });
    }
})


module.exports = {
    todoRoute
}
