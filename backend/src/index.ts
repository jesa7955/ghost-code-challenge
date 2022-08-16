import express, { NextFunction, Request, Response } from "express";
import { getComments, postComment, increaseVote, decreaseVote} from "./controller";

const app = express();
const port = 3000;

app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.json({ errorMessage: err.message }).status(500);
});

app.get("/api/get_comments", getComments);
app.post("/api/post_comment", postComment);
app.put("/api/increase_vote", increaseVote);
app.put("/api/decrease_vote", decreaseVote);

app.listen(port, () => console.log(`Listening on ${port}!`));
