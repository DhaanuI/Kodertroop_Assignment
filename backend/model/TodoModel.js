const mongoose = require("mongoose")

const todoSchema = mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    priority: { type: String, enum: ["low", "high"], default: 'low' },
    status: { type: String, enum: ["pending", "completed"], default: 'pending' },
    userID: String
})

const TodoModel = mongoose.model("todo", todoSchema)

module.exports = {
    TodoModel
}

