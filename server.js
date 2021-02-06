const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const { dbConnection } = require("./configDB");

const app = express();
app.use(cors());
app.use(express.json());
dbConnection();

//app.use(express.static("public"));


app.use("/api/login", require("./routes/auth"));
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/mascotas", require("./routes/mascotas"));
app.use("/api/upload", require("./routes/uploads"));
app.use("/api/notification", require("./routes/notification"));

/* app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
}); */

const PORT = process.env.PORT || 3014;
app.listen(PORT, () => {
  console.log("server iniciado en puerto ", PORT);
});
