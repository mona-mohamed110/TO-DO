# Tasklane

A full-stack task manager built with React, Express, and MongoDB Atlas, configured to deploy on Vercel.

## Features

- Add, complete, reopen, and delete tasks, all persisted in MongoDB Atlas
- Filters for all, pending, and completed tasks, with live counters and a progress bar
- Client and server validation (empty, whitespace-only, and over-length titles are rejected)
- Duplicate-submission protection while a request is in flight
- Loading skeletons, empty states, retryable error states, and toast confirmations
- Delete confirmation using an accessible native dialog
- Responsive layout (desktop sidebar, mobile top bar), keyboard focus states, semantic HTML

## Tech stack

React 18 + Vite, plain CSS, Lucide icons, Node.js + Express, Mongoose, MongoDB Atlas, Vercel (static frontend + serverless API).

## Project structure

```
tasklane/
├── api/index.js              Vercel serverless entry (exports the Express app)
├── backend/
│   ├── server.js             Local dev server (not used on Vercel)
│   └── src/
│       ├── app.js            Express app (middleware, routes, error handling)
│       ├── db.js             Cached MongoDB connection (serverless-safe)
│       ├── models/Task.js
│       ├── controllers/tasks.js
│       ├── routes/tasks.js
│       ├── middleware/errors.js
│       └── utils/            validation + HTTP helpers
├── frontend/
│   └── src/                  App, components, hooks/useTasks.js, api/tasks.js, styles.css
├── vercel.json
└── package.json              npm workspaces (frontend + backend)
```

How production works: Vercel serves `frontend/dist` as static files. `vercel.json` rewrites every `/api/*` request to `api/index.js`, which runs the Express app as a serverless function. The frontend calls the relative path `/api`, so no URLs are hardcoded.

## Local setup

Requirements: Node.js 20.6+ (22 recommended) and a free MongoDB Atlas cluster.

```bash
npm install
cp backend/.env.example backend/.env    # then edit backend/.env
npm run dev
```

The web app runs at http://localhost:5173 and proxies `/api` to the API at http://localhost:5000. Check http://localhost:5000/api/health to confirm the API is up.

## MongoDB Atlas setup

1. Create a free account at mongodb.com/atlas and create a free (M0) cluster.
2. Database Access: add a database user with a strong password (readWrite on any database is enough).
3. Network Access: add IP address `0.0.0.0/0`. Vercel uses dynamic IPs, so this is required for the demo. Use a strong password.
4. Connect, then Drivers: copy the connection string and insert your username, password, and a database name such as `tasklane`.
5. If the password has special characters, URL-encode them.

## Environment variables

| Variable | Where | Required | Description |
| --- | --- | --- | --- |
| `MONGODB_URI` | `backend/.env` locally, Vercel project settings in production | Yes | Atlas connection string |
| `PORT` | `backend/.env` | No | Local API port (default 5000) |
| `CLIENT_ORIGIN` | `backend/.env` or Vercel | No | Comma-separated allowed origins; only needed when the frontend is on a different domain |
| `VITE_API_URL` | `frontend/.env` | No | Override API base URL; leave unset for same-origin `/api` |

Real `.env` files are git-ignored. Only `.env.example` files are committed.

## Deploy to GitHub and Vercel

```bash
git init
git add .
git commit -m "Initial commit: Tasklane"
git branch -M main
git remote add origin https://github.com/<your-username>/tasklane.git
git push -u origin main
```

(Create the empty repository on github.com first.) Then on vercel.com:

1. Add New, then Project, and import the GitHub repository.
2. Framework Preset: **Other**. Root Directory: leave as the repository root.
3. Build Command: `npm run build`. Output Directory: `frontend/dist`. Install Command: `npm install`. (These match `vercel.json`.)
4. Environment Variables: add `MONGODB_URI` for Production, Preview, and Development.
5. Click Deploy. Your URL appears when the build finishes.

## Post-deploy checklist

- [ ] `https://<your-domain>/api/health` returns `{"success":true,...}`
- [ ] `https://<your-domain>/api/tasks` returns `{"success":true,"data":[]}`
- [ ] Add a task: it appears and a confirmation toast shows
- [ ] Refresh the page: the task is still there (stored in Atlas)
- [ ] Submit an empty and a whitespace-only task: an error is shown
- [ ] Toggle completion, switch filters, and check the counters
- [ ] Delete a task: the confirmation dialog appears, then the task is removed
- [ ] Check layouts at mobile, tablet, and desktop widths
- [ ] Remove `MONGODB_URI` temporarily or break it to confirm the error state and Try again button work

## API

All responses are JSON: `{ "success": true, "data": ... }` or `{ "success": false, "error": { "message": "..." } }`.

| Method | Endpoint | Body | Success | Errors |
| --- | --- | --- | --- | --- |
| GET | `/api/health` | none | 200 | none |
| GET | `/api/tasks` | none | 200, array of tasks (newest first) | 503 |
| POST | `/api/tasks` | `{ "title": "string, 1-120 chars" }` | 201, created task | 400, 503 |
| PATCH | `/api/tasks/:id` | `{ "completed": true }` | 200, updated task | 400 (bad id or body), 404, 503 |
| DELETE | `/api/tasks/:id` | none | 200, `{ "id": "..." }` | 400, 404, 503 |

Task shape: `{ id, title, completed, createdAt, updatedAt }`.
