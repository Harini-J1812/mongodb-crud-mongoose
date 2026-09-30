require("dotenv").config();
 
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
 
const app = express();
 
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log(error);
    });

const travelSchema = new mongoose.Schema({
 
    buddyId: String,
    name: String,
    destination: String,
    age: Number,
    budget: Number,
    tripDuration: Number,
    interests: String,
    status: String
 
});

const Traveller = mongoose.model("Traveller", travelSchema);
 
app.get("/", (req, res) => {
 
    res.sendFile(path.join(__dirname, "index2.html"));
 
});

app.post("/travellers", async (req, res) => {
 
    console.log(req.body);
 
    const traveller = new Traveller({
 
        buddyId: req.body.buddyId,
        name: req.body.name,
        destination: req.body.destination,
        age: Number(req.body.age),
        budget: Number(req.body.budget),
        tripDuration: Number(req.body.tripDuration),
        interests: req.body.interests,
        status: req.body.status
 
    });
 
    await traveller.save();
 
    res.send("Travel buddy added successfully");
 
});
 
app.get("/travellers/search", async (req, res) => {
 
    const destination = req.query.destination;
    const budget = Number(req.query.budget);
 
    const travellers = await Traveller.find({
 
        destination: destination,
        budget: { $gt: budget }
 
    });
 
    res.json(travellers);
 
});

app.get("/travellers/searchById", async (req, res) => {
 
    const traveller = await Traveller.findOne({
 
        buddyId: req.query.buddyId
 
    });
 
    res.json(traveller);
 
});
 
 
app.get("/travellers/details", async (req, res) => {
 
    const traveller = await Traveller.findOne(
 
        { buddyId: req.query.buddyId },
 
        {
            _id: 0,
            name: 1,
            destination: 1,
            budget: 1,
            tripDuration: 1
        }
 
    );
 
    res.json(traveller);
 
});
 

app.post("/travellers/update", async (req, res) => {
 
    const traveller = await Traveller.findOneAndUpdate(
 
        { buddyId: req.body.buddyId },
 
        {
            destination: req.body.destination,
            budget: Number(req.body.budget)
        },
 
        { returnDocument: "after" }
 
    );
 
    res.json(traveller);
 
});

app.post("/travellers/increaseBudget", async (req, res) => {
 
    const result = await Traveller.updateMany(
 
        { destination: req.body.destination },
 
        {
            $inc: {
                budget: Number(req.body.amount)
            }
        }
 
    );
 
    res.json(result);
 
});
 

app.get("/travellers/range", async (req, res) => {
 
    const min = Number(req.query.min);
    const max = Number(req.query.max);
 
    const travellers = await Traveller.find({
 
        budget: {
            $gte: min,
            $lte: max
        }
 
    });
 
    res.json(travellers);
 
});
 
app.post("/travellers/delete", async (req, res) => {
 
    const traveller = await Traveller.findOneAndDelete({
 
        buddyId: req.body.buddyId
 
    });
 
    res.json(traveller);
 
});
 
 
app.get("/travellers/final", async (req, res) => {
 
    const travellers = await Traveller.find()
        .sort({ budget: -1 });
 
    res.json(travellers);
 
});

app.listen(3000, () => {
 
    console.log("Server running on port 3000");
 
});