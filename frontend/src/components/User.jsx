import * as React from "react";
import PropTypes from "prop-types";
import { generateTimeString, generateUserInfo } from "../hooks";

function VerticalLine() {
  return (
    <div className="d-flex mx-3 h-100 pb-5">
      <div className="vr-solid" />
    </div>
  );
}

function Avatar({ userId, isParent }) {
  const { iconUrl } = generateUserInfo(userId);
  return (
    <div className="col-auto">
      <div className="row">
        <img
          src={iconUrl}
          width="38"
          height="38"
          className="rounded-circle"
          alt="user-icon"
        />
      </div>
      {isParent && <VerticalLine />}
    </div>
  );
}

function Username({ userId, createdAt, now }) {
  const { userName } = generateUserInfo(userId);
  return (
    <div className="row gx-2 align-items-baseline">
      <p className="col-auto fw-bold">{userName}</p>
      <p className="col-auto post-time-dot">•</p>
      <p className="col-auto post-time-prompt pb-0">
        {generateTimeString(createdAt, now)}
      </p>
    </div>
  );
}

Avatar.propTypes = {
  userId: PropTypes.number,
  isParent: PropTypes.bool,
};

Username.propTypes = {
  userId: PropTypes.number,
  createdAt: PropTypes.instanceOf(Date),
  now: PropTypes.instanceOf(Date),
};

export { Avatar, Username };
