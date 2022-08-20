import * as React from "react";
import PropTypes from "prop-types";
import {
  ApiUrlContext,
  EventSourceContext,
  ReloadCommentContext,
  UserInfoContext,
} from "../context";
import { generateTimeString, generateUserInfo, updateVote } from "../hooks";

function Comment({props}) {
  const { createdAt, commentId, content, upvote, now, userId } = props;
  const [updatedVote, setUpdatedVote] = React.useState(upvote);
  const apiBaseUrl = React.useContext(ApiUrlContext);
  const eventSource = React.useContext(EventSourceContext);
  const currentUser = React.useContext(UserInfoContext);
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const { userName, iconUrl } = generateUserInfo(userId);

  React.useEffect(() => {
    if (eventSource) {
      eventSource.addEventListener('update', (e) => {
        const data = JSON.parse(e.data);
        if (data.id == commentId) {
          setUpdatedVote(data.upvote);
        }
      });
    }
  }, [eventSource]);

  const flipButtonState = (e) => {
    const amount = isUpvoted ? -1 : 1;
    setUpdatedVote(updatedVote + amount);
    setIsUpvoted(!isUpvoted);
    updateVote(apiBaseUrl, { id: commentId, userId: currentUser.userId, amount });
  };

  return (
    <div>
      <div className="row pb-5">
        <div className="col-auto">
          <img
            src={iconUrl}
            width="38"
            height="38"
            className="rounded-circle"
            alt="icon"
          />
        </div>
        <div className="col-11 flex-start">
          <div className="row gx-2 align-items-baseline">
            <p className="col-auto fw-bold">{userName}</p>
            <p className="col-auto post-time-dot">•</p>
            <p className="col-auto post-time-prompt pb-0">
              {generateTimeString(createdAt, now)}
            </p>
          </div>
          <div className="row">
            <p>{content}</p>
          </div>
          <div className="row button-area">
            <div className="col-auto">
              <div className="row gx-3 align-items-baseline">
                <p className="col-auto">{updatedVote}</p>
                <button
                  className="col-auto btn btn-light comment-button"
                  onClick={flipButtonState}
                  type="button"
                >
                  {isUpvoted ? "Upvoted" : "Upvote"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommentList({commentList}) {
  const [now, setNow] = React.useState(new Date());
  const setReloadFlag = React.useContext(ReloadCommentContext);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const newNow = new Date();
      setNow(newNow);
      setReloadFlag(newNow);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container" id="comment-post-form">
      {commentList.map((comment) => (
        <Comment key={comment.commentId} props={{ now, ...comment }} />
      ))}
    </div>
  );
}

CommentList.propTypes = {
  commentList: PropTypes.array,
  eventSource: PropTypes.object,
};

Comment.proTypes = {
  tserId: PropTypes.number,
  createdAt: PropTypes.any,
  now: PropTypes.any,
  commentId: PropTypes.number,
  content: PropTypes.string,
  upvote: PropTypes.number,
};

export default CommentList;
