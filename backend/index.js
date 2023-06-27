const express = require("express");

// dotenv to securely store values 
require("dotenv").config();
const cors = require("cors")
const app = express();
app.use(express.json());

app.use(cors())

// importing necessary things from other files
const { connection } = require("./config/db");
const { userRoute } = require("./route/userRoute");
const { todoRoute } = require("./route/todoRoute");


// home route
app.get("/", async (req, res) => {
    res.status(200).send("Welcome to Todo Backend");
})

// redirect routes
app.use("/users", userRoute)
app.use("/todo", todoRoute)

const { Client } = require('@elastic/elasticsearch');


const elasticClient = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    },
});

const createIndexRequest = {
    index: 'tasks',
};

elasticClient.indices.create(createIndexRequest)
    .then(() => {
        app.listen(process.env.port, async (req, res) => {
            try {
                await connection;   // connecting to Database
                console.log("DB is connected");
            }
            catch (error) {
                console.log("Error connecting to DB", error);
            }
            console.log(`Server listening at Port ${process.env.port}`);
        });
    })
    .catch((error) => {
        console.error('Error creating index:', error);
    });


