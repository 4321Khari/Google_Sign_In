require('dotenv').config();
const { string } = require('mathjs');
const mongoose = require("mongoose");
const findorCreate = require('mongoose-findorcreate');

const db = process.env.DB_URL

const connectingToDb = mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true });


const userSchema = new mongoose.Schema({
    googleId: String,
    displayName: String,
    email: String,
    image: String,
    accessToken: String
});
userSchema.plugin(findorCreate);

const User = new mongoose.model("User", userSchema);

module.exports = { connectingToDb, User }
