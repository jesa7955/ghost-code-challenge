# ghost-code-challenge

## Project Structure
- `migration`: Database setup with knex.
- `backend`: The API talks to database and returns data in json.
   - SSE event to notify upvote count update.
   - A user randomization endpoint included :)
- `frontend`: Support realtime upvote display, nested comments with React

## Local development setup
k8s and [skaffold](https://github.com/GoogleContainerTools/skaffold/) was used for local development.
- Install k8s and skaffold.
  - Docker Desktop with WSL tested.
- Run `start-local.sh` to install required cusstom k8s operator.
- Run `skaffold dev` and wait for the migration job (check the log output).
- Go to `http://comment.localdev.me:8080/` to check the UI.
