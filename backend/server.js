const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});


// Routes
app.use("/api/auth", require("./routes/auth"));


app.listen(process.env.PORT, () => {

  console.log(`Server Running On ${process.env.PORT}`);

});