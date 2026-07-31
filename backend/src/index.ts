import { db } from "./config/db";
import app from "./app";

const PORT = Number(process.env.PORT);

async function startServer() {
  try {
    const conn = await db.getConnection();
    conn.release();

    console.log("Database connected");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed");
    console.error(err);
    process.exit(1);
  }
}

startServer();