import '../scss/styles.scss';
// eslint-disable-next-line no-unused-vars
import * as bootstrap from 'bootstrap';

const $ = require('jquery');

const apiBaseUrl = '/api';

const generateTimeString = (timestamp) => {
  const now = new Date();
  const secondPast = now - timestamp;
  const msInMin = 60000;
  const minInHour = 60;
  const hourInDay = 24;
  const dayInWeek = 7;
  if (secondPast < msInMin) {
    return 'Less than 1 min';
  }
  if (secondPast < msInMin * minInHour) {
    return `${Math.floor(secondPast / msInMin)} min ago`;
  }
  if (secondPast < msInMin * minInHour * hourInDay) {
    return `${Math.floor(secondPast / msInMin / minInHour)} hrs ago`;
  }
  if (secondPast < msInMin * minInHour * hourInDay * dayInWeek) {
    return `${Math.floor(
      secondPast / msInMin / minInHour / hourInDay,
    )} days ago`;
  }
  return `${Math.floor(
    secondPast / msInMin / minInHour / hourInDay / dayInWeek,
  )} weeks ago`;
};

const generateHtmlForComment = (comment) => {
  const {
    id, content, upvote, createdAt,
  } = comment;
  return `
      <div class="row pb-5">
        <div class="col-auto">
          <img src="https://avatars.githubusercontent.com/u/7817026?v=4" width="38" height="38" class="rounded-circle">
        </div>
        <div class="col-11 flex-start">
          <div class="row gx-2 align-items-baseline">
            <p class="col-auto fw-bold">Tong Li</p>
            <p class="col-auto post-time-dot">•</p>
            <p class="col-auto post-time-prompt pb-0">${generateTimeString(
    createdAt,
  )}</p>
          </div>
          <div class="row">
            <p id="comment-content-${id}">${content}</p>
          </div>
          <div class="row button-area">
            <div class="col-auto">
              <div class="row gx-3 align-items-baseline">
                <p class="col-auto" id="comment-upvote-${id}">${upvote}</p>
                <button class="col-auto btn btn-light comment-button" id="comment-upvote-btn-${id}">Upvote</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
};

const parseComments = (commentList) => {
  const temp = commentList.map((o) => Object.assign(o, {
    createdAt: new Date(o.createdAt),
    modifiedAt: new Date(o.modifiedAt),
  }));
  temp.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return temp;
};

const displayComments = () => {
  $.ajax({
    url: `${apiBaseUrl}/get_comments`,
    type: 'GET',
    dataType: 'json',
  })
    .done((commentList) => {
      const commentTable = parseComments(commentList);
      $('#comment-list').html(
        commentTable
          .map((comment) => generateHtmlForComment(comment))
          .join('\n'),
      );
    })
    .fail(() => {
      // eslint-disable-next-line no-alert
      alert('Sorry, we could load the comments');
    });
};

const postComent = (comment) => {
  $.ajax({
    url: `${apiBaseUrl}/post_comment`,
    type: 'POST',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify(comment),
  })
    .done(displayComments)
    .fail(() => {
      alert('failed to post comment');
    });
};

const updateVote = (event) => {
  const button = $(event.target);
  const upvoted = button.text() === 'Upvoted';
  const newText = upvoted ? 'Upvote' : 'Upvoted';
  const endpoint = upvoted ? 'decrease_vote' : 'increase_vote';
  const diff = upvoted ? -1 : 1;
  const voteId = button.attr('id').replace('-btn', '');
  const id = +voteId.split('-')[2];
  const vote = +$(`#${voteId}`).text();
  $.ajax({
    url: `${apiBaseUrl}/${endpoint}`,
    type: 'PUT',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify({ id }),
  })
    .done(() => {
      $(`#${voteId}`).text(vote + diff);
      button.text(newText);
    })
    .fail(() => {
      alert('failed to update vote count');
    });
};

$(() => {
  displayComments();
  $('#comment-form').on('submit', (event) => {
    event.preventDefault();
    const formInput = $('#comment-content');
    const content = formInput.val().trim();
    if (content === '') {
      return null;
    }
    const now = new Date();
    const comment = { content, createdAt: now, modifiedAt: now };
    formInput.val('');
    postComent(comment);
    return null;
  });
  $('#comment-list').on(
    'click',
    "button[id^='comment-upvote-btn-']",
    updateVote,
  );
});

window.setInterval(() => {
  displayComments();
}, 10000);
