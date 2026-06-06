require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const cors = require("cors");

const chatRouter = require("./routes/chat");

const app = express();
const PORT = process.env.PORT || 3001;

// Allow the Next.js dev server (port 3000) to call this agent
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/chat", chatRouter);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`\x1b[35m[Agent]\x1b[0m Server running on http://localhost:${PORT}`);
});
