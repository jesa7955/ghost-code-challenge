import { createContext } from "react";

const ApiUrlContext = createContext("");

const EventSourceContext = createContext(null);

const ReloadCommentContext = createContext(null);

const UserInfoContext = createContext(null);

export {
  ApiUrlContext,
  EventSourceContext,
  ReloadCommentContext,
  UserInfoContext,
};
