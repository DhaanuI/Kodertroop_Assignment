const { Client } = require('@elastic/elasticsearch');
require("dotenv").config();

const elasticClient = new Client({
    cloud: {
        id: process.env.ELASTIC_CLOUD_ID,
    },
    auth: {
        username: process.env.ELASTIC_USERNAME,
        password: process.env.ELASTIC_PASSWORD,
    },
});

// const createIndex = async (indexName) => {
//     await elasticClient.indices.create({ index: indexName });
//     console.log("Index created");
// };

// createIndex("tasks");


// async function deleteIndex() {
//     await elasticClient.indices.delete({ index: 'tasks' });
// }

// deleteIndex()



module.exports = { elasticClient }