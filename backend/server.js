const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());


// Routes
app.use("/api/auth", require("./routes/auth"));


app.listen(process.env.PORT, () => {

  console.log(`Server Running On ${process.env.PORT}`);

});