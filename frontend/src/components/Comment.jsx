import * as React from "react";
import PropTypes from "prop-types";
import {
  ApiUrlContext,
  EventSourceContext,
  ReloadCommentContext,
  UserInfoContext,
} from "../context";
import { updateVote, postComment } from "../hooks";
import { Avatar, Username } from "./User";

function Button({
  buttonText,
  onClickAction,
  additionalParam = "btn-light comment-button",
}) {
  return (
    <div className="col-auto">
      <button
        className={`btn ${additionalParam} small-button`}
        onClick={onClickAction}
        type="button"
      >
        {buttonText}
      </button>
    </div>
  );
}

Button.propTypes = {
  buttonText: PropTypes.string,
  onClickAction: PropTypes.func,
  additionalParam: PropTypes.string,
};

function NestedComment({ setIsCommenting, parentId }) {
  const [content, setContent] = React.useState("");
  const { userId } = React.useContext(UserInfoContext);
  const setReloadFlag = React.useContext(ReloadCommentContext);
  const apiBaseUrl = React.useContext(ApiUrlContext);
  const handleInput = (event) => {
    setContent(event.target.value);
  };
  const handleClick = () => {
    if (content.trim() !== "") {
      postComment(apiBaseUrl, { userId, content, parentId }, setReloadFlag);
      setContent("");
      setIsCommenting(false);
    }
  };
  return (
    <div className="px-2">
      <div className="row">
        <textarea
          type="text"
          id="comment-content"
          placeholder="What are you feedback?"
          rows="2"
          form="comment-form"
          className="form-control"
          value={content}
          onChange={handleInput}
        />
      </div>
      <div className="row d-flex justify-content-end pt-1">
        <Button
          buttonText="Cancel"
          onClickAction={() => setIsCommenting(false)}
          additionalParam="btn-secondary"
        />
        <Button
          buttonText="Comment"
          onClickAction={handleClick}
          additionalParam="btn-primary"
        />
      </div>
    </div>
  );
}

NestedComment.propTypes = {
  setIsCommenting: PropTypes.func,
  parentId: PropTypes.number,
};

function Comment({ comment, childComponent }) {
  const {
    createdAt,
    now,
    commentId,
    content,
    upvote,
    userId,
    parentId,
    children,
  } = comment;
  const [updatedVote, setUpdatedVote] = React.useState(upvote);
  const [isUpvoted, setIsUpvoted] = React.useState(false);
  const [isCommenting, setIsCommenting] = React.useState(false);
  const apiBaseUrl = React.useContext(ApiUrlContext);
  const eventSource = React.useContext(EventSourceContext);
  const currentUser = React.useContext(UserInfoContext);

  React.useEffect(() => {
    if (eventSource) {
      eventSource.addEventListener("update", (e) => {
        const data = JSON.parse(e.data);
        if (data.id === commentId) {
          setUpdatedVote(data.upvote);
        }
      });
    }
  }, [eventSource]);

  const flipButtonState = () => {
    const amount = isUpvoted ? -1 : 1;
    setUpdatedVote(updatedVote + amount);
    setIsUpvoted(!isUpvoted);
    updateVote(apiBaseUrl, {
      id: commentId,
      userId: currentUser.userId,
      amount,
    });
  };

  return (
    <div className="row">
      <Avatar userId={userId} isParent={children.length > 0} />
      <div className="col-11">
        <Username userId={userId} createdAt={createdAt} now={now} />
        <div className="row">
          <p>{content}</p>
        </div>
        <div className="row button-area align-items-baseline gx-3">
          <div className="col-auto upvote-count">
            <p>{updatedVote}</p>
          </div>
          <Button
            buttonText={isUpvoted ? "Upvoted" : "Upvote"}
            onClickAction={flipButtonState}
          />
          {!parentId && !isCommenting && (
            <Button
              buttonText="Reply"
              onClickAction={() => setIsCommenting(true)}
            />
          )}
        </div>
        {isCommenting && (
          <NestedComment
            setIsCommenting={setIsCommenting}
            userId={userId}
            parentId={commentId}
          />
        )}
        {childComponent}
      </div>
    </div>
  );
}

const CommentType = {
  createdAt: PropTypes.instanceOf(Date),
  now: PropTypes.instanceOf(Date),
  commentId: PropTypes.number,
  content: PropTypes.string,
  upvote: PropTypes.number,
  userId: PropTypes.number,
  parentId: PropTypes.number,
};
CommentType.children = PropTypes.arrayOf(PropTypes.shape(CommentType));

Comment.propTypes = {
  comment: PropTypes.shape(CommentType),
  childComponent: PropTypes.arrayOf(Comment.element),
};

function CommentItem({ commentItem }) {
  const { children } = commentItem;
  const childComponent = children.map((childItem) => (
    <div key={childItem.commentId} className="row pt-3">
      <Comment comment={childItem} childComponent={null} />
    </div>
  ));
  return (
    <div className="row pb-3">
      <Comment
        comment={{
          ...commentItem,
          hasChildren: commentItem.children.length > 0,
        }}
        childComponent={childComponent}
      />
    </div>
  );
}

CommentItem.propTypes = {
  commentItem: PropTypes.shape(CommentType),
};

function CommentList({ commentList }) {
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
    <div className="container" id="comment-list">
      {commentList.map((comment) => (
        <CommentItem
          key={comment.commentId}
          commentItem={{ now, ...comment }}
        />
      ))}
    </div>
  );
}

CommentList.propTypes = {
  commentList: PropTypes.arrayOf(PropTypes.shape(CommentType)),
};

export default CommentList;
