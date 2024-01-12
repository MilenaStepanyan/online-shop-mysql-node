import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRouter from "./auth.js";
import adminResponsibilityRouter from "./adminResponsibility.js";
import { isAdmin } from "./isAdmin.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/admin", isAdmin, adminResponsibilityRouter);
app.get("/admin-only", isAdmin, (req, res) => {
  res.json({ message: "Admin-only route" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
