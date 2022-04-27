import express from "express";
import cors from "cors";
import morgan from "morgan";
import { join, dirname } from "path";
import { LowSync, JSONFileSync } from "lowdb";
import { fileURLToPath } from "url";
import booksRouter from "./routes/books.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import lodash from "lodash";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Books API",
      version: "1.0.0",
      description: "API for books",
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

const PORT = process.env.PORT || 4000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
console.log(file);
const adapters = new JSONFileSync(file);
const db = new LowSync(adapters);
db.read();
db.data = db.data || { books: [], users: [], users: [] };

const app = express();
db.chain = lodash.chain(db.data);

app.db = db;
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/books", booksRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default db;
