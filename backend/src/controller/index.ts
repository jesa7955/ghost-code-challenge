import { database } from "../database";
import { CommentService, UserType } from "../post";
import { Response, Request } from "express";
import { CommentType } from "../post";
import { getUser } from "../user";

const commentServer = new CommentService(
  database,
  process.env.DB_COMMENTS_TABLE,
  process.env.DB_USERS_TABLE
);

export const getComments = async (req: Request, res: Response) => {
  commentServer.getListOfComents().then((data) => res.json(data));
};

export const postComment = async (req: Request, res: Response) => {
  const data: CommentType & UserType = req.body;
  commentServer.postComment(data).then(() => {
    res.json({ status: "Success to insert a record" });
  });
};

export const increaseVote = async (req: Request, res: Response) => {
  const { id } = req.body;
  commentServer
    .increaseVote(id)
    .then(() =>
      res.json({ status: `Success to update the vote of comment ${id}` })
    );
};

export const decreaseVote = async (req: Request, res: Response) => {
  const { id } = req.body;
  commentServer
    .decreaseVote(id)
    .then(() =>
      res.json({ status: `Success to update the vote of comment ${id}` })
    );
};

export const getUserId = async (req: Request, res: Response) => {
  res.json({ userId: getUser() });
};
