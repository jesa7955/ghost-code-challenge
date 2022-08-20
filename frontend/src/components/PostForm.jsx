import * as React from "react";
import PropTypes from "prop-types";
import {
  ApiUrlContext,
  ReloadCommentContext,
  UserInfoContext,
} from "../context";
import { postComent } from "../hooks";

function CommentPostForm() {
  const { userId, iconUrl } = React.useContext(UserInfoContext);
  const apiBaseUrl = React.useContext(ApiUrlContext);
  const setReloadFlag = React.useContext(ReloadCommentContext);
  const [content, setContent] = React.useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    if (content.trim() != '') {
      postComent(apiBaseUrl, { userId, content }, setReloadFlag);
      setContent("");
    }
  };
  const handleInput = (event) => {
    setContent(event.target.value);
  };
  return (
    <div className="container" id="comment-post-form">
      <div className="row pt-5">
        <p className="fs-3 fw-bolder">Discussion</p>
      </div>
      <form
        className="row justify-content-between"
        id="comment-form"
        onSubmit={handleSubmit}
      >
        <div className="col-auto">
          <img
            src={iconUrl}
            width="38"
            height="38"
            className="rounded-circle"
            id="user-icon"
            alt="user-icon"
          />
        </div>
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
        <hr className="hr-solid" />
      </div>
    </div>
  );
}

CommentPostForm.propTypes = {
  userInfo: PropTypes.object,
  eventSource: PropTypes.object,
};

export default CommentPostForm;
