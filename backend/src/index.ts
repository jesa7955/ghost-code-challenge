import express from "express";
import { database } from "./database";
import { CommentService, CommentType } from "./post";

const app = express();
const port = 3000;
const commentServer = new CommentService(
  database,
  process.env.DB_COMMENTS_TABLE
);

app.use(express.json());

app.get("/get_comments", async (req, res) => {
  commentServer
    .getListOfComents()
    .then((data) => res.json(data))
    .catch((err: Error) => {
      console.error(err);
      res.json({ errorMessage: err.message }).status(500);
    });
});
app.post("/post_comment", async (req, res) => {
  const data: CommentType = req.body;
  commentServer
    .postComment(data)
    .then(() => {
      res.json({ status: "Success to insert a record" });
    })
    .catch((err: Error) => {
      console.error(err);
      res.json({ errorMessage: err.message }).status(500);
    });
});
app.listen(port, () => console.log(`Listening on ${port}!`));
