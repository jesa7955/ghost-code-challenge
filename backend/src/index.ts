import express, { NextFunction, Request, Response } from "express";
import {
  getComments,
  postComment,
  getUserId,
  updateVote,
  subscribeVoteUpdate,
} from "./controller";

const app = express();
const port = 3000;

app.use(express.json());
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.json({ errorMessage: err.message }).status(500);
});

app.get("/api/get_comments", getComments);
app.get("/api/get_user", getUserId);
app.post("/api/post_comment", postComment);
app.put("/api/update_vote", updateVote);
app.get("/api/subscribe_vote_update", subscribeVoteUpdate);

app.listen(port, () => console.log(`Listening on ${port}!`));
