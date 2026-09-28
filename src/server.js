const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect("mongodb://user_453vzxdxq:p453vzxdxq@db01.dbhost.dev:5050/db_453vzxdxq")
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log(error);
    });

// Mongoose Schema
const memberSchema = new mongoose.Schema({
    memberId: String,
    name: String,
    department: String,
    club: String
});

// Mongoose Model
const Member = mongoose.model("Member", memberSchema);

// Display HTML page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Insert member
app.post("/members", async (req, res) => {
    console.log(req.body);

    const member = new Member({
        memberId: req.body.memberId,
        name: req.body.name,
        department: req.body.department,
        club: req.body.club
    });

    await member.save();

    res.send("Club member added successfully");
});

// Start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});