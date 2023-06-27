const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRoute = express.Router();
userRoute.use(express.json());
const moment = require("moment");

const { redisClient } = require("../config/db")
require("dotenv").config();

const { UserModel } = require("../model/UserModel");

// to register user and then hashing password using Bcrypt
userRoute.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const userFound = await UserModel.findOne({ email });
    if (userFound) {
        res.status(409)({ "message": "Already User registered" });
    }
    else {
        try {
            let dateFormat = moment().format('D-MM-YYYY');

            bcrypt.hash(password, 5, async function (err, hash) {
                const data = new UserModel({ name, email, password: hash, registeredDate: dateFormat })
                await data.save();
                res.status(201).send({ "message": "User registered" })
            });
        }
        catch (err) {
            res.status(500)({ "ERROR": err });
        }
    }
})

// to let user login and then storing token
userRoute.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let data = await UserModel.findOne({ email });
    if (!data) {
        return res.send({ "message": "No User Found" });
    }
    try {
        bcrypt.compare(password, data.password, function (err, result) {
            if (result) {
                var token = jwt.sign({ userID: data._id }, process.env.key, { expiresIn: 60 * 30 });
                var refreshtoken = jwt.sign({ userID: data._id }, process.env.key, { expiresIn: 60 * 90 });
                res.status(201).send({ "message": "Validation done", "token": token, "refresh": refreshtoken })
            }
            else {
                res.status(401).send({ "message": "INVALID credentials" });
            }
        });
    }
    catch (err) {
        res.status(500)({ "ERROR": err });
    }
})

// implementing logout using json file 
userRoute.post("/logout", async (req, res) => {
    const token = req.headers.authorization;
    if (token) {
        // <------------ REDIS usage
        await redisClient.sadd("keyname", token);
        res.send({ "message": "Logout done successfully" });
    }
    else {
        res.send({ "message": "Please login" });
    }
})

module.exports = {
    userRoute
}