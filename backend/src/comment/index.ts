import { Knex } from "knex";

export type CommentType = {
  id?: number;
  parentId?: number;
  content: string;
  upvote?: number;
  createdAt?: Date;
  modifiedAt?: Date;
};

export type UserType = {
  userId: number;
};

export type VoteUpdateType = {
  id: number;
  amount: number;
}

export class CommentService {
  databaseEngine: Knex;
  commentTable: string;
  userTable: string;

  constructor(databaseEngine: Knex, commentTable: string, userTable: string) {
    this.databaseEngine = databaseEngine;
    this.commentTable = commentTable;
    this.userTable = userTable;
  }

  async getListOfComents() {
    return this.databaseEngine
      .queryBuilder()
      .select()
      .from<CommentType>(this.commentTable)
      .join(
        this.userTable,
        `${this.commentTable}.id`,
        "=",
        `${this.userTable}.commentId`
      )
      .orderBy([
        {column: `${this.commentTable}.id`, order: 'desc'},
      ]);
  }

  async postComment(data: CommentType & UserType) {
    const { userId } = data;
    delete data.userId;
    return this.databaseEngine.transaction((trx) => {
      return trx
        .insert(data, "id")
        .into(this.commentTable)
        .then((ids) => {
          const { id } = ids[0];
          return trx.insert({ commentId: id, userId }).into(this.userTable);
        });
    });
  }

  async updateVote({id, amount}: VoteUpdateType) {
    return this.databaseEngine(this.commentTable)
      .where({ id })
      .increment("upvote", amount)
      .update({modifiedAt: new Date()}, ['id', 'upvote']);
  }
}
