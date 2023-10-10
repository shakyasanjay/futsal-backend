const express = require("express");
const app = express();
const db = require("./db");
const routes = require("./routes");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
