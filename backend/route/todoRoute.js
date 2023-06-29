const express = require("express");
const todoRoute = express.Router();
todoRoute.use(express.json());

const { TodoModel } = require("../model/TodoModel");
const { authenticate } = require("../middleware/authenticate.middleware");

todoRoute.use(authenticate);

// usage of REDIS and ELASTIC SEARCH
const { redisClient } = require("../config/db")
const { elasticClient } = require("../elastic")



// get the TODOS from Elastic Cloud
todoRoute.get("/", async (req, res) => {
    try {
        //  const data = await TodoModel.find({ userID: req.body.userID });

        const result = await elasticClient.search({
            index: "tasks",
            body: {
                query: {
                    term: {
                        userID: {
                            value: req.body.userID,
                        },
                    },
                },
            },
        });

        redisClient.lrange("tasks", 0, -1, (err, redisTasks) => {
            if (err) {
                console.error("Error retrieving tasks from Redis:", err);
                return res.status(500).send({ error: "Error retrieving tasks" });
            }

            const parsedRedisTasks = redisTasks.map(task => JSON.parse(task));
        })


        const hits = result.hits.hits;

        const items = hits.map(item => ({
            _id: item._id,
            data: item._source
        }));


        res.status(200).send({ "Todos": items });
    }
    catch (err) {
        console.log(err)
        res.status(404).send({ "error": err });
    }
})


// store data in all 3 Mongodb, redis, elastic cloud
todoRoute.post("/add", async (req, res) => {
    try {
        // storing in Mongoose
        const object = {
            title: req.body.title,
            priority: req.body.priority,
            description: req.body.description == undefined ? undefined : req.body.description,
            userID: req.body.userID,
            status: req.body.status
        }
        const data = new TodoModel(object);
        await data.save();

        // elastic search
        const result = await elasticClient.index({
            index: "tasks",
            document: object
        });

        redisClient.rpush("tasks", JSON.stringify(object));

        res.send({ "message": "Data added" });
    }
    catch (err) {
        console.log(err)
        res.status(404).send({ "error": err });
    }

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


// delete from elastic cloud and redis
todoRoute.delete("/delete/:id", async (req, res) => {
    try {
        const result = await elasticClient.delete({
            index: "tasks",
            id: req.params.id
        });

        const deleteResult = await redisClient.lrem("tasks", 0, JSON.stringify({ id: req.params.id }));

        res.send({ "message": "Todo has been deleted" })
    }
    catch (err) {
        res.status(404).send({ "message": "Bad request 404" });
    }
})


todoRoute.get("/search", async (req, res) => {
    const { query, userID } = req.query;
    try {
        const result = await elasticClient.search({
            index: "tasks",
            query: {
                bool: {
                    must: [
                        {
                            multi_match: {
                                query: query,
                                fields: ["title", "description"]
                            }
                        },
                        {
                            term: {
                                userID: userID
                            }
                        }
                    ]
                }
            }
        });

        const hits = result.hits.hits;

        const items = hits.map(item => ({
            _id: item._id,
            data: item._source
        }));

        res.send({ "Todos": items });
    } catch (error) {
        console.error("Error performing search:", error);
        res.status(500).json({ error: "An error occurred during the search." });
    }
});



module.exports = {
    todoRoute
}
