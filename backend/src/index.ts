import express, { NextFunction, Request, Response } from "express";
import { getComments, postComment, updateVote } from "./controller";

const app = express();
const port = 3000;

app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.json({ errorMessage: err.message }).status(500);
});

app.get("/get_comments", getComments);
app.post("/post_comment", postComment);
app.put("/update_vote", updateVote);

app.listen(port, () => console.log(`Listening on ${port}!`));
