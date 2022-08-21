import * as React from "react";
import {
  ApiUrlContext,
  ReloadCommentContext,
  UserInfoContext,
} from "../context";
import { postComment } from "../hooks";
import { Avatar } from "./User";

function CommentPostForm() {
  const { userId } = React.useContext(UserInfoContext);
  const apiBaseUrl = React.useContext(ApiUrlContext);
  const setReloadFlag = React.useContext(ReloadCommentContext);
  const [content, setContent] = React.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    if (content.trim() !== "") {
      postComment(apiBaseUrl, { userId, content }, setReloadFlag);
      setContent("");
    }
  };
  const handleInput = (event) => {
    setContent(event.target.value);
  };
  return (
    <div className="container" id="comment-post-form">
      <div className="row py-4">
        <p className="fs-3 fw-bold">Discussion</p>
      </div>
      <form className="row" id="comment-form" onSubmit={handleSubmit}>
        <Avatar userId={userId} isParent={false} />
        <div className="col-10">
          <textarea
            type="text"
            className="form-control"
            id="comment-content"
            placeholder="What are you thoughts?"
            rows="1"
            form="comment-form"
            value={content}
            onChange={handleInput}
          />
        </div>
        <div className="input-group-btn col-auto">
          <button type="submit" className="btn btn-primary" id="post-comment">
            Comment
          </button>
        </div>
      </form>
      <div className="row px-3 py-5">
        <div className="hr-solid" />
      </div>
    </div>
  );
}

export default CommentPostForm;
