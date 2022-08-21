# ghost-code-challenge

## Project Structure

- `migration`: Database setup with knex.
- `backend`: The API talks to database and returns data in json.
  - `get_comments`: `GET` endpoint to get the a list of comments
  - `post_comment`: `POST` Endpoint to add a new comment. user id and content of the comment are required.
  - `update_vote`: `PUT` method to update the upvote count after the `Upvote` button of a comment is clicked. A server-sent event will be fired to notify clients about the update after the DB insertion succeeds.
  - `subscribe_vote_update`: `GET` method for clients to listen on the vote update events.
  - `get_user`: `GET` method to get a randomized user info, including a user id, a user name, and a icon url. Powered by the list of unicode smileys emoji and [noto-emoji](https://github.com/googlefonts/noto-emoji).
- `frontend`: Support realtime upvote display, nested comments with React
  - V1: JQuery + Bootstrap V5.2
  - V2: Migrate Javascript parts to React
    - Tree structures to support nested comments are built in the frontend.
    - `axios` is used to interact with backend.
- `k8s`: Kubernetes manifests to simplify the develpment (database setup, cleanup, ...) and deployment.
  - [skaffold](https://github.com/GoogleContainerTools/skaffold/) was used.

## Local development setup

- Prepare a k8s cluster (minikube, Docker Desktop, microk8s, ...) and install skaffold.
  - Docker Desktop with WSL tested.
- Run `start-local.sh` to install required cusstom k8s operator.
- Run `skaffold dev` and wait for the migration job (check the log output).
- Go to `http://comment.localdev.me:8080/` to check the UI.
