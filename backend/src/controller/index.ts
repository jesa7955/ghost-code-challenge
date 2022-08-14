import { database } from "../database";
import { CommentService } from "../post";
import { Response, Request } from "express";
import { CommentType } from "../post";

const commentServer = new CommentService(
  database,
  process.env.DB_COMMENTS_TABLE
);

export const getComments = async (req: Request, res: Response) => {
  commentServer.getListOfComents().then((data) => res.json(data));
};

export const postComment = async (req: Request, res: Response) => {
  const data: CommentType = req.body;
  commentServer.postComment(data).then(() => {
    res.json({ status: "Success to insert a record" });
  });
};

export const updateVote = async (req: Request, res: Response) => {
  const { id } = req.body;
  commentServer
    .updateVote(id)
    .then(() =>
      res.json({ status: `Success to update the vote of comment ${id}` })
    );
};
