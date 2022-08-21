import axios from "axios";

const generateTimeString = (timestamp) => {
  const now = new Date();
  const secondPast = now - timestamp;
  const msInMin = 60000;
  const minInHour = 60;
  const hourInDay = 24;
  const dayInWeek = 7;
  if (secondPast < msInMin) {
    return "Less than 1 min";
  }
  if (secondPast < msInMin * minInHour) {
    return `${Math.floor(secondPast / msInMin)} min ago`;
  }
  if (secondPast < msInMin * minInHour * hourInDay) {
    return `${Math.floor(secondPast / msInMin / minInHour)} hrs ago`;
  }
  if (secondPast < msInMin * minInHour * hourInDay * dayInWeek) {
    const days = Math.floor(secondPast / msInMin / minInHour / hourInDay);
    if (days === 1) {
      return "Yesterday";
    }
    return `${days} days ago`;
  }
  return `${Math.floor(
    secondPast / msInMin / minInHour / hourInDay / dayInWeek
  )} weeks ago`;
};

const generateUserInfo = (userId) => {
  const hexCode = userId.toString(16).toLowerCase();
  return {
    iconUrl: `https://raw.githubusercontent.com/googlefonts/noto-emoji/main/png/72/emoji_u${hexCode}.png`,
    userName: `Anonymous ${userId}`,
  };
};

const postComment = (apiBaseUrl, comment, setReloadFlag) => {
  axios
    .post(`${apiBaseUrl}/post_comment`, comment)
    .then(() => setReloadFlag(new Date()))
    .catch((error) => alert(`failed to post comment: ${error.message}`));
};

const updateVote = (apiBaseUrl, update) => {
  axios
    .put(`${apiBaseUrl}/update_vote`, update)
    .catch((error) => alert(`failed to update vote count: ${error.message}`));
};

const getUserInfo = (apiBaseUrl, setUserInfo) => {
  axios
    .get(`${apiBaseUrl}/get_user`)
    .then((res) => {
      setUserInfo(res.data);
    })
    .catch((error) => alert(`failed to get the uesr info: ${error.message}`));
};

const getComments = (apiBaseUrl, setCommentList) => {
  axios
    .get(`${apiBaseUrl}/get_comments`)
    .then((res) => {
      const parsedCommentList = res.data.map((comment) =>
        Object.assign(comment, {
          createdAt: new Date(comment.createdAt),
          modifiedAt: new Date(comment.modifiedAt),
          children: [],
        })
      );
      const parents = new Map(
        parsedCommentList
          .filter((comment) => comment.parentId === null)
          .map((comment) => [comment.commentId, comment])
      );
      parsedCommentList.forEach((comment) => {
        const { parentId } = comment;
        if (parentId != null) {
          const parent = parents.get(parentId);
          parent.children.push(comment);
        }
      });
      setCommentList(Array.from(parents.values()));
    })
    .catch((error) => {
      alert(`failed to get comments: ${error.message}`);
    });
};

export {
  generateTimeString,
  postComment,
  updateVote,
  getUserInfo,
  getComments,
  generateUserInfo,
};
