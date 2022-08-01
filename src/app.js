import express from "express";
import sessionRoutes from "./routes/session.routes";
import userRouter from "./routes/users.routes";
import "dotenv/config";

const app = express();
app.use(express.json());

app.use("/users", userRouter);
app.use("/login", sessionRoutes);

app.listen(3000);

export default app;
