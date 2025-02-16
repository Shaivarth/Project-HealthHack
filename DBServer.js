require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Client } = require("pg");
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
app.use(express.json());
app.use(cors());

// PostgreSQL Connection
const pgClient = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Render
});

pgClient.connect()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch(err => console.error("❌ PostgreSQL Connection Error:", err.stack));

// MongoDB Connection
const mongoClient = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectMongoDB() {
  try {
    await mongoClient.connect();
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}
connectMongoDB();

// Signup Endpoint
app.post("/signup", async (req, res) => {
  const { email, password, name, age, gender } = req.body;

  try {
    // Check if user already exists
    const existingUser = await pgClient.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password and store user
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pgClient.query(
      "INSERT INTO users (email, password, name, age, gender) VALUES ($1, $2, $3, $4, $5) RETURNING id",
      [email, hashedPassword, name, age, gender]
    );

    // Generate JWT token
    const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pgClient.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Close database connections when process ends
process.on("SIGINT", async () => {
  await pgClient.end();
  await mongoClient.close();
  console.log("❌ Database connections closed");
  process.exit();
});
