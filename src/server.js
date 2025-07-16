import express from "express";
import config from "./config/index.js";
import { connectDB } from "./db/index.js";
import { CreateSuperadmin } from "./db/create-superadmin.js";
import AdminRouter from "./routes/admin.route.js";
import CategoryRouter from "./routes/category.route.js";
import ProductRouter from "./routes/product.route.js";
import SalesmanRouter from "./routes/salesman.route.js";
import ClientRouter from "./routes/client.route.js";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());

await connectDB();
await CreateSuperadmin();
app.use(cookieParser());

app.use("/admin", AdminRouter);
app.use("/category", CategoryRouter);
app.use("/salesman", SalesmanRouter);
app.use("/product", ProductRouter);
app.use("/client", ClientRouter);

app.listen(config.PORT, () => {
  console.log(`✅ Server is running:
  ├─ Port       : ${config.PORT}
  ├─ Mode       : ${"Development"}
  └─ Time       : ${new Date().toLocaleString()}
  `);
});
