require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDatabase = require("./db");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "features", "uploads")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/candidate", require("./routes/candidate"));
app.use("/api/recruiter", require("./routes/recruiter"));
app.use("/api/admin", require("./routes/admin"));

app.get("/", (req, res) => {
  res.send("Authentication API is running");
});

async function startServer() {
  try {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes("replace_with")) {
      throw new Error("Set JWT_SECRET in Backend/.env before starting the server.");
    }

    await connectDatabase();

    const [{ default: jobRoutes }, { default: resourceRoutes }, { default: expertRoutes }, { default: bookingRoutes }] = await Promise.all([
      import("./features/src/routes/jobRoutes.js"),
      import("./features/src/routes/resourceRoutes.js"),
      import("./features/mentorship/routes/expertRoutes.js"),
      import("./features/mentorship/routes/bookingRoutes.js"),
    ]);
    app.use("/api/jobs", jobRoutes);
    app.use("/api/resources", resourceRoutes);
    app.use("/api/experts", expertRoutes);
    app.use("/api/bookings", bookingRoutes);
    app.use((error, req, res, next) => {
      console.error(error);
      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Server error",
      });
    });

    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
