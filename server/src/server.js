import app from "./app.js";
import pool from "./db/pool.js";

const PORT = Number(process.env.PORT) || 5000;

async function startServer() {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to the database successfully.");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
}

startServer();
