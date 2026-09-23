const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  salary: { type: Number, required: true },
  experience: { type: Number, required: true },
  skills: [String],
  status: { type: String, required: true }
});

const Employee = mongoose.model("Employee", employeeSchema);

async function crud() {
  // 1. Insert 4 employees
  await Employee.deleteMany();

  await Employee.insertMany([
    {
      employeeId: "E101", name: "Arun", department: "IT",
      designation: "Developer", salary: 50000, experience: 3,
      skills: ["Java", "Node.js"], status: "Active"
    },
    {
      employeeId: "E102", name: "Priya", department: "HR",
      designation: "HR Executive", salary: 45000, experience: 4,
      skills: ["Recruitment"], status: "Active"
    },
    {
      employeeId: "E103", name: "Rahul", department: "IT",
      designation: "Tester", salary: 40000, experience: 2,
      skills: ["Testing", "Selenium"], status: "Active"
    },
    {
      employeeId: "E104", name: "Divya", department: "Finance",
      designation: "Accountant", salary: 55000, experience: 5,
      skills: ["Excel", "Tally"], status: "Active"
    }
  ]);

  // 2. Department + experience
  console.log("IT employees with experience > 2:");
  console.log(await Employee.find({
    department: "IT",
    experience: { $gt: 2 }
  }));

  // 3. Find one using employeeId
  console.log("Employee E101:");
  console.log(await Employee.findOne({ employeeId: "E101" }));

  // 4. Display selected fields
  console.log("Name, Designation, Salary, Department:");
  console.log(await Employee.find({}, {
    _id: 0,
    name: 1,
    designation: 1,
    salary: 1,
    department: 1
  }));

  // 5. Update designation and salary
  await Employee.updateOne(
    { employeeId: "E101" },
    { $set: { designation: "Senior Developer", salary: 60000 } }
  );

  // 6. Increase salary of IT employees by 10%
  await Employee.updateMany(
    { department: "IT" },
    { $mul: { salary: 1.10 } }
  );

  // 7. Salary range
  console.log("Salary between 40000 and 60000:");
  console.log(await Employee.find({
    salary: { $gte: 40000, $lte: 60000 }
  }));

  // 8. Delete one employee
  await Employee.deleteOne({ employeeId: "E104" });

  // 9. Remaining employees sorted by salary descending
  console.log("Remaining employees:");
  console.log(await Employee.find().sort({ salary: -1 }));
}

crud();