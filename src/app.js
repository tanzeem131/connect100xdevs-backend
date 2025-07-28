const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket");
require("dotenv").config();
let { PORT, CLIENT_URL } = process.env;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? CLIENT_URL
        : "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const server = http.createServer(app);

initializeSocket(server);

const authRouter = require("./routes/auth");
const enquiryRouter = require("./routes/enquiry");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", enquiryRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", chatRouter);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`server is running on port:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection not established");
  });
