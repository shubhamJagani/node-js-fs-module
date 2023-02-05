require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./routes/index");

app.use(express.json({ limit: "50mb" }));
app.use("/api", router);

app.listen(port, () => {
  console.log(`starting port on http://localhost:${port}`);
});
