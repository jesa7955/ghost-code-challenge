import { Knex } from "knex";

export type CommentType = {
  id?: number;
  parentId?: number;
  content: string;
  upvote?: number;
};

export type CommentDatabaseType = CommentType & {
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
    console.log("here");
    return this.databaseEngine(this.tableName).insert(comment);
  }
}
