import { Knex } from "knex";

export type CommentType = {
  id?: number;
  parentId?: number;
  content: string;
  upvote?: number;
  createdAt?: Date;
  modifiedAt?: Date;
};

export class CommentService {
  databaseEngine: Knex;
  tableName: string;

  constructor(databaseEngine: Knex, tableName: string) {
    this.databaseEngine = databaseEngine;
    this.tableName = tableName;
  }

  async getListOfComents() {
    return this.databaseEngine
      .queryBuilder()
      .select()
      .from<CommentType>(this.tableName);
  }

  async postComment(comment: CommentType) {
    return this.databaseEngine(this.tableName).insert(comment);
  }

  async increaseVote(id: number) {
    return this.databaseEngine(this.tableName)
      .where({ id })
      .increment("upvote", 1)
      .update("modifiedAt", new Date());
  }

  async decreaseVote(id: number) {
    return this.databaseEngine(this.tableName)
      .where({ id })
      .decrement("upvote", 1)
      .update("modifiedAt", new Date());
  }
}
