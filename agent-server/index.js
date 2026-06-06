require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");

const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/chat", chatRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
