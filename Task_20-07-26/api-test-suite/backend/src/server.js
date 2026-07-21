const { createDb } = require("./db.js");
const createApp = require("./app.js");
const { seed } = require("./seed.js");

const DB_PATH = process.env.DB_PATH || "./data/dev.db";
const PORT = process.env.PORT || 5000;

const db = createDb(DB_PATH);

if (process.env.SEED === "true") {
  seed(db);
}

const app = createApp(db);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
