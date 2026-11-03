# Backend architecture

This API is an Express + MongoDB service that handles **authentication** (who the user is) and **authorization** (what that user is allowed to do). After login or signup it creates a **JWT session cookie**. The browser sends that cookie on later requests so the user can open protected routes without logging in again.

## How a request flows

1. `server.js` starts Express, connects to MongoDB, and mounts route files.
2. Public auth routes in `routes/auth.js` create or check a user, then set an httpOnly `token` cookie.
3. Protected routes (`/api/candidate`, `/api/recruiter`, `/api/admin`) run `middleware/authMiddleware.js` first.
4. Job and Prep Zone routes under `features/src/routes` verify the same JWT cookie before candidate/recruiter actions.
5. Mentor directory and booking routes under `features/mentorship` use the same JWT session for candidate bookings.
6. The middleware verifies the JWT, loads the user from MongoDB, and either allows the request or returns `401` / `403`.

```
Browser
  -> server.js (CORS, JSON, cookies)
    -> routes/auth.js          (signup, login, me, logout)
    -> routes/candidate.js     (candidate-only)
    -> routes/recruiter.js     (recruiter-only)
    -> routes/admin.js         (admin-only)
    -> features/src/routes/jobRoutes.js (jobs, saved jobs, applications, alerts)
    -> features/src/routes/resourceRoutes.js (Prep Zone resources)
    -> features/mentorship/routes/expertRoutes.js (mentor directory, profiles, availability)
    -> features/mentorship/routes/bookingRoutes.js (candidate bookings)
         -> middleware/authMiddleware.js
              -> models/user.js (MongoDB User collection)
```

## File responsibilities

| File | Responsibility |
| --- | --- |
| `server.js` | App entry point. Loads `.env`, enables CORS with credentials, parses JSON and cookies, mounts `/api/*` routes, connects to the database, and starts the HTTP server. |
| `db.js` | Opens MongoDB. Uses `MONGO_URI` in normal setups, or an in-memory database when `USE_IN_MEMORY_DB=true`. |
| `.env` | Runtime config: `PORT`, `MONGO_URI`, `USE_IN_MEMORY_DB`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV`. Never commit real secrets. |
| `models/user.js` | Mongoose schema for users: `name`, `email`, `college`, `dob`, hashed `password`, and `role` (`candidate`, `recruiter`, `admin`). Also exposes `toSafeJSON()` so passwords are never sent to the client. |
| `routes/auth.js` | Public auth API. Signup (name, email, college, dob, password, role), login (email, password, role), current user (`GET /me`), and logout. Issues and clears the JWT cookie. |
| `middleware/authMiddleware.js` | `requireAuth` reads the `token` cookie, verifies the JWT, and attaches `req.user`. `requireRole(...)` blocks users whose role is not allowed. |
| `routes/candidate.js` | Candidate-only endpoints. Requires a valid session **and** `role === "candidate"`. |
| `routes/recruiter.js` | Recruiter-only endpoints. Requires a valid session **and** `role === "recruiter"`. |
| `routes/admin.js` | Admin-only endpoints. Requires a valid session **and** `role === "admin"`. Admin accounts are not created through public signup. |
| `features/src/controllers/jobController.js` | Job and internship listing, filtering, recruiter posting, candidate saves, applications, and alerts. |
| `features/src/controllers/resourceController.js` | Prep Zone resource listing, uploads, likes, and deletion. |
| `features/src/models/*.js` | Mongoose models for jobs, saved jobs, applications, alerts, and resources. |
| `features/src/routes/*.js` | Mounts the job and Prep Zone APIs; candidate/recruiter role restrictions are applied here. |
| `features/src/middleware/authMiddleware.js` | Verifies the existing JWT cookie (or a Bearer token) against `JWT_SECRET`; there is no development-header or localStorage identity fallback. |
| `features/src/middleware/uploadMiddleware.js` | Validates uploaded resource files with Multer and stores them in `features/uploads`; Express exposes them under `/uploads`. |
| `features/mentorship/controllers/expertController.js` | Serves the searchable mentor directory, mentor details, and availability. |
| `features/mentorship/controllers/bookingController.js` | Validates session service and availability, then creates candidate bookings in MongoDB. |
| `features/mentorship/models/Expert.js` and `Booking.js` | Mongoose models for the mentor catalog and candidate bookings. |
| `features/mentorship/middleware/auth.js` | Verifies the existing JWT cookie and restricts booking creation to candidate accounts. |
| `package.json` | Backend scripts and libraries, including Multer for resource uploads. |

The old `modelss/` folder was unused after this setup. The live user model lives in `models/user.js`.

## Auth and session details

- Passwords are hashed with **bcrypt** before they are stored.
- The JWT payload is `{ userId, role }` and expires in **7 days**.
- The token is stored in an **httpOnly cookie** named `token` (not `localStorage`), so JavaScript cannot read it.
- `sameSite: "lax"` and `credentials: true` CORS let the React app on `CLIENT_URL` send the cookie.
- Login requires a **role choice** for candidate, recruiter, or admin. If the account's stored role does not match (for example a recruiter logging in as a candidate), the API returns `403`.
- Public signup accepts candidate and recruiter only. Admin accounts must be provisioned through a trusted administrative process; never enable admin self-registration.

## HTTP API

Base URL in development: `http://localhost:5000`

### Public

- `POST /api/auth/signup`  
  Body: `{ name, email, college, dob, password, role }`  
  `role` must be `candidate` or `recruiter`. Sets the session cookie.

- `POST /api/auth/login`  
  Body: `{ email, password, role }`, where role is `candidate`, `recruiter`, or `admin`.  
  Sets the session cookie if credentials and role match.

- `POST /api/auth/logout`  
  Clears the session cookie.

### Authenticated

Send the cookie automatically with `credentials: "include"`.

- `GET /api/auth/me` — current user (any logged-in role).
- `GET /api/candidate/home` — candidate home data.
- `GET /api/recruiter/dashboard` — recruiter dashboard data.
- `GET /api/admin/dashboard` — admin dashboard data.
- `GET /api/jobs` and `GET /api/jobs/:id` — public job and internship listings.
- Candidate session: `/api/jobs/saved`, `/api/jobs/applications`, `/api/jobs/alerts`, `POST /api/jobs/:id/save`, and `POST /api/jobs/:id/apply`.
- Recruiter/admin session: `POST`, `PUT`, and `DELETE /api/jobs` endpoints for job listings.
- `/api/resources` — Prep Zone resources; create and like actions require a session.
- `GET /api/experts` and `GET /api/experts/:id` — mentor directory and mentor details.
- `POST /api/bookings` — candidate-only mentor session booking; requires the JWT session cookie.

The frontend provides protected destinations at `/home` for candidates, `/recruiter` for recruiters, and `/admin` for admins. The login page's role choice must match the role stored on the account.

## Local run

1. Set `Backend/.env`. `JWT_SECRET` is required. Put your Atlas or local URI in `MONGO_URI`, and keep `USE_IN_MEMORY_DB=false` so that URI is used.
2. For MongoDB Atlas, add this machine’s IP under **Network Access** (or `0.0.0.0/0` while developing). Include a database name in the URI, for example `/job-portal-new`.
3. From `Backend`: `npm install` then `npm run dev`.
4. From `my-react-app`: `npm install` then `npm run dev` (expects this API at `http://localhost:5000`; set `VITE_API_URL` to override it).

## Create an admin account

Admin signup is intentionally not public. Use the backend script once to create an account. In PowerShell, from `Backend`:

```powershell
$env:ADMIN_PASSWORD = "choose-a-strong-password"
npm run create:admin -- --name "Platform Admin" --email "admin@example.com" --college "OpportunityHub" --dob "1990-01-01"
Remove-Item Env:ADMIN_PASSWORD
```

The script hashes the password with bcrypt, creates an account with `role: "admin"`, and refuses to replace an existing user. Then use the **Admin** choice on the login page with the email and password you set.
