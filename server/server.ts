import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { gpt3Endpoint } from "gpt3rocket";
const port = process.env.port || 8000;
const app = express();
import { key } from "./../settings/key.json";
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.resolve(__dirname, "..", "dist")));
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
});

const config = {
  credential: key,
};
app.post("/chat", gpt3Endpoint(config));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
