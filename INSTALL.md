# Quick Start Guide

## Backend

- Install dependencies:

  1. Backend python requirements: `pip install requirements.txt` (tested using python version 3.13.0)

  2. Latex environment: [textlive](https://www.tug.org/texlive/acquire-netinstall.html) (for linux - `apt update && apt install -y texlive`)

- Setup [MongoDB database](https://www.mongodb.com/docs/manual/installation/) (either using mongodb atlas or locally hosted docker container), once done create a database named `mydatabase` and set the `MONGODB_HOST_STRING` env variable to the full connection string. (eg. `mongodb://db:27017/mydatabase`)

- Also set the `BASE_FRONTEND_URL` env variable to the base url of the frontend (eg: `http://localhost:3000`)

- Run the application using `flask run`

## Frontend

- `pnpm` is the preferred package manager, but `npm` or `yarn` can also be used.

- Install dependencies using `pnpm install --frozen-lockfile`

- Set the `REACT_APP_BACKEND_BASE_URL` to the base url of the backend (eg: `http://localhost:5000`), it can also be edited in the `frontend/src/api/base.ts` file.

- Run the application using `pnpm start`
