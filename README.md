# 🌿 Karnataka Diet Planner 

Full-stack website: **React (Vite) + Express + SQLite**. English / ಕನ್ನಡ throughout.

## Run it (3 commands)

```bash
npm run setup     # installs server + client, builds the website (once)
npm run seed      # OPTIONAL: adds 6 demo users + 14 days of tracker data
npm start         # → http://localhost:5000
```

Open **http://localhost:5000** — you land on the public **home page** (not the login page).
Visitors can browse everything first; they log in only when they want a personal plan.

| Where | URL |
|---|---|
| Public website (landing, foods, BMI, FAQ, contact) | http://localhost:5000 |
| User login / register | /login · /register |
| Admin portal | /admin/login — `admin@kdp.com` / `Admin@1234` |
| Demo users (after `npm run seed`) | `ravi@demo.com`, `suresh@demo.com` … password `Demo@1234` |

## Website pages

**Public (no login):** Home (hero, live stats, features, how it works, **interactive sample plan**, superfoods,
regional cuisine, 9 health conditions, **BMI + calorie calculator**, FAQ, contact form) · **Explore Foods**
(search + filter 73 dishes by diet / goal / meal / "safe for condition").

**User app (after login):** Dashboard (streak, calorie target, today's progress) · Diet Plan (today / 7-day menu / all meals,
health-condition guidance) · Meal Tracker (tick meals, swap dishes, water, notes, history) · Profile (details, conditions, BMI, change password).

**Language:** EN / ಕನ್ನಡ switch on every page. Dish names, descriptions and health tips are stored in Kannada in the database.
(Admin portal is English only.)

## Showing the database to an evaluator

1. **In the browser:** Admin portal → **Database Viewer**
   - *Browse tables* – all 5 tables with schema, live rows, pagination
   - *SQL console* – read-only `SELECT` queries (preset queries included, Ctrl+Enter to run)
   - *Download kdp.db* – opens in "DB Browser for SQLite"
2. **In the terminal:** `npm run db:show` (all tables) or `npm --prefix server run db:show users`
3. **File:** `server/data/kdp.db`

Tables: `users` · `trackers` · `meals` (73 dishes, EN+KN) · `conditions` (10, EN+KN) · `messages` (contact form)

Passwords are stored as **bcrypt hashes** (you'll see `$2a$10$…` in the viewer).

## Admin portal
Dashboard stats · Users (view/edit/disable/delete) · Tracker records · **Food Catalogue** (add/edit/delete dishes — appears instantly on the site) ·
**Messages** (contact-form inbox) · Database Viewer · Settings (change admin password).

## Development mode
```bash
npm run dev:server   # API on :5000
npm run dev:client   # website with hot reload on :5173
```
After changing client code run `npm run build` so port 5000 serves the new version.

## Reset
Delete `server/data/kdp.db` and restart — a clean database (admin + catalogue) is recreated.

## Notes
- Config: `server/.env` (PORT, JWT_SECRET, admin email/password).
- Plans are chosen per user + date (stable on refresh); *New suggestions* reshuffles.
- Nutrition content is general guidance, not medical advice.
