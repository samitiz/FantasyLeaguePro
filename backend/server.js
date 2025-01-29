import bodyParser from "body-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import transferMarket from "./routes/transferMarket.js";
import playerRoutes from "./routes/playerRoutes.js";
import HttpError from "./middleware/http-error.js";

dotenv.config();

// connecting to database
connectDB();

const app = express();

// Body Parser
app.use(bodyParser.json());

app.use(cors());

// Routes
app.use("/api/auth", authRoutes); // authRoutes
app.use("/api/team", teamRoutes); // teamRoutes
app.use("/api/transactions", transactionRoutes); // transactionRoutes
app.use("/api/transfer-market", transferMarket); // transferMarket Routes
app.use("/api/player", playerRoutes); // playerRoutes

// MiddleWare For Unknown Routes
app.use((req, res, next) => {
    const error = new HttpError("Could Not Find This Route ", 404);
    throw error;
  });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
