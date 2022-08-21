import "./styles.scss";
import * as React from "react";
import CommentPostForm from "./components/PostForm";
import CommentList from "./components/Comment";
import {
  ApiUrlContext,
  EventSourceContext,
  ReloadCommentContext,
  UserInfoContext,
} from "./context";
import { getComments, getUserInfo } from "./hooks";

function App() {
  const apiBaseUrl = "/api";
  const [userInfo, setUserInfo] = React.useState(null);
  const [eventSource, setEventSource] = React.useState(null);
  const [reloadFlag, setReloadFlag] = React.useState(false);
  const [commentList, setCommentList] = React.useState([]);
  React.useEffect(() => {
    getUserInfo(apiBaseUrl, setUserInfo);
  }, []);
  React.useEffect(() => {
    getComments(apiBaseUrl, setCommentList);
  }, [reloadFlag]);
  React.useEffect(() => {
    if (userInfo) {
      const targetEventSource = new EventSource(
        `${apiBaseUrl}/subscribe_vote_update?userId=${userInfo.userId}`
      );
      setEventSource(targetEventSource);
    }
    return () => eventSource?.close();
  }, [userInfo]);
  if (!userInfo || !eventSource) {
    return null;
  }
  return (
    <UserInfoContext.Provider value={userInfo}>
      <ReloadCommentContext.Provider value={setReloadFlag}>
        <ApiUrlContext.Provider value={apiBaseUrl}>
          <EventSourceContext.Provider value={eventSource}>
            <CommentPostForm />
            <CommentList commentList={commentList} />
          </EventSourceContext.Provider>
        </ApiUrlContext.Provider>
      </ReloadCommentContext.Provider>
    </UserInfoContext.Provider>
  );
}

export default App;
