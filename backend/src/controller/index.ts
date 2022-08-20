import { database } from "../database";
import { CommentService, UserType, CommentType, VoteUpdateType } from "../comment";
import { Response, Request } from "express";
import { getUser } from "../user";

const commentServer = new CommentService(
  database,
  process.env.DB_COMMENTS_TABLE,
  process.env.DB_USERS_TABLE
);

const userResponseTable: Map<number, Response> = new Map();

type VoteNotificationType = {
  id: number,
  upvote: number,
}

const notifyChangeToClients = (userId: number, data: VoteNotificationType) => {
  Array.from(userResponseTable).forEach((pair, _) => {
    const [uid, res] = pair;
    if (uid != userId) {
      res.write("event: update\n")
      res.write("data: " + JSON.stringify(data) + '\n\n');
    }
  });
} 

export const getComments = async (req: Request, res: Response) => {
  commentServer.getListOfComents().then((data) => res.json(data));
};

export const postComment = async (req: Request, res: Response) => {
  const data: CommentType & UserType = req.body;
  commentServer.postComment(data).then(() => {
    res.json({ status: "Success to insert a record" });
  });
};

export const updateVote = async (req: Request, res: Response) => {
  const data: VoteUpdateType & {userId: number} = req.body;
  const userId = data.userId;
  delete data.userId;
  commentServer
    .updateVote(data)
    .then((updatedResult) => {
      notifyChangeToClients(userId, updatedResult[0]);
      res.json({ status: `Success to update the vote of comment ${data.id}` })
    });
};

export const getUserId = async (req: Request, res: Response) => {
  const userId = getUser();
  const hexCode = userId.toString(16).toLowerCase();
  res.json({
    userId,
    userName: `Anonymous ${userId}`,
    iconUrl: `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/72/emoji_u${hexCode}.png`,
  });
};

export const subscribeVoteUpdate = async(req: Request, res: Response) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  const userId = +req.query.userId;
  userResponseTable.set(userId, res);
  res.writeHead(200, headers);
  req.on('close', () => {
    console.log(`${userId} Connection closed`);
    userResponseTable.delete(userId);
  });
};