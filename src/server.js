require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
 
const app = express();
 
app.use(express.urlencoded({ extended: true }));
 

mongoose.connect(
    process.env.MONGO_URI
)
.then(() => {
    console.log("MongoDB connected");
})
.catch((error) => {
    console.log(error);
});

const memberSchema = new mongoose.Schema({
 
    memberId: String,
 
    name: String,
 
    club: String,
 
    yearOfStudy: Number,
 
    role: String,
 
    points: Number,
 
    interests: String,
 
    status: String
 
});

const Member = mongoose.model("Member", memberSchema);
 
 
// Display HTML page
app.get("/", (req, res) => {
 
    res.sendFile(path.join(__dirname, "index.html"));
 
});
 

app.post("/members", async (req, res) => {
 
    console.log(req.body);
 
    const member = new Member({
 
        memberId: req.body.memberId,
 
        name: req.body.name,
 
        club: req.body.club,
 
        yearOfStudy: req.body.yearOfStudy,
 
        role: req.body.role,
 
        points: req.body.points,
 
        interests: req.body.interests,
 
        status: req.body.status
 
    });
 
    await member.save();
 
    res.send("Club member added successfully");
 
});
 
app.get("/members/search", async (req, res) => {
 
    const members = await Member.find({
 
        club: req.query.club,
 
        points: {
            $gt: Number(req.query.points)
        }
 
    });
 
    res.json(members);
 
});
 
 
app.get("/members/searchById", async (req, res) => {
 
    const member = await Member.findOne({
 
        memberId: req.query.memberId
 
    });
 
    res.json(member);
 
});
 
app.get("/members/details", async (req, res) => {
 
    const member = await Member.findOne(
 
        {
            memberId: req.query.memberId
        },
 
        {
            _id: 0,
            name: 1,
            club: 1,
            role: 1,
            points: 1
        }
 
    );
 
    res.json(member);
 
});
 
app.post("/members/update", async (req, res) => {
 
    const member = await Member.findOneAndUpdate(
 
        {
            memberId: req.body.memberId
        },
 
        {
            role: req.body.role,
            points: Number(req.body.points)
        },
 
        {
        returnDocument: "after"
        }
 
    );
 
    res.json(member);
 
});

app.post("/members/increasePoints", async (req, res) => {
 
    const result = await Member.updateMany(
 
        {
            club: req.body.club
        },
 
        {
            $inc: {
                points: Number(req.body.amount)
            }
        }
 
    );
 
    res.send(
        result.modifiedCount +
        " members updated successfully"
    );
 
});

app.get("/members/range", async (req, res) => {
 
    const members = await Member.find({
 
        points: {
 
            $gte: Number(req.query.min),
 
            $lte: Number(req.query.max)
 
        }
 
    });
 
    res.json(members);
 
});

app.post("/members/delete", async (req, res) => {
 
    const member = await Member.findOneAndDelete({
 
        memberId: req.body.memberId
 
    });
 
    res.send("Member deleted successfully");
 
});

app.get("/members/final", async (req, res) => {
 
    const members = await Member.find()
        .sort({
            points: -1
        });
 
    res.json(members);
 
});

app.listen(3000, () => {
 
    console.log("Server running on port 3000");
 
});