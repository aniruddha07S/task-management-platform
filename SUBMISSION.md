# Submission — Full Stack Intern Technical Assessment

**Project:** Taskflow — Task & Team Management Platform  
**Candidate:** Aniruddha Sutawane  
**Date:** 24 September 2026

---

## 1. Links

| Item | Link |
|---|---|
| GitHub Repository | https://github.com/aniruddha07S/task-management-platform |
| Live Frontend (Vercel) | https://task-management-platform-sepia.vercel.app |
| Live Backend (Render) | https://task-management-platform-wbvq.onrender.com |
| README (setup, API docs, screenshots) | [`README.md`](README.md) |
| API Collection (Postman v2.1) | [`Taskflow.postman_collection.json`](Taskflow.postman_collection.json) |
| Submission PDF (with screenshots) | [`docs/Taskflow_Submission.pdf`](docs/Taskflow_Submission.pdf) |

> **Note:** The backend is hosted on Render's free tier and sleeps when idle. The **first request may take up to ~50 seconds**; after that it responds normally.

---

## 2. Login Credentials (deployed website)

| Role | Email | Password |
|---|---|---|
| User | `testuser@example.com` | `Test@1234` |
| Admin | `admin@example.com` | `Admin@1234` |

Both accounts are pre-seeded in MongoDB Atlas and verified working on the live deployment. The login page also has **"Use User" / "Use Admin"** buttons that fill these in automatically.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Redux Toolkit, Tailwind CSS v4 |
| Backend | Node.js, Express 5, JWT, bcrypt |
| Database | MongoDB Atlas (Mongoose) |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

All three tiers are live and connected.

---

## 4. Requirements Checklist

### Authentication
| Requirement | Status | Implementation |
|---|---|---|
| Register | ✅ | `POST /api/auth/register` + Register page |
| Login | ✅ | `POST /api/auth/login` returns JWT |
| JWT authentication | ✅ | `server/middleware/auth.js` validates `Bearer` token |
| Protected routes | ✅ | Backend middleware + frontend `ProtectedRoute` |
| Logout | ✅ | Clears Redux state and stored token |
| Remember Me | ✅ | Checked → 30-day token in localStorage; unchecked → 1-day token in sessionStorage |
| bcrypt password hashing | ✅ | `bcrypt.hash(password, 10)` |

### Dashboard
| Requirement | Status | Implementation |
|---|---|---|
| Sidebar | ✅ | `Sidebar.jsx` — task lists with live counts, user, theme toggle, logout |
| Navbar | ✅ | Sticky toolbar with title, search and "New Task" |
| Cards: Total / Pending / Completed / In Progress | ✅ | `StatCard.jsx`, data from `GET /api/tasks/stats` |

### Task Module
| Requirement | Status |
|---|---|
| Create | ✅ |
| Edit | ✅ |
| Delete (with confirmation dialog) | ✅ |
| View Details | ✅ `TaskDetail.jsx` |
| Fields: title, description, priority, due date, status, assigned user | ✅ |

### Search & Filters
| Requirement | Status |
|---|---|
| Search by title (debounced) | ✅ |
| Filter by status | ✅ |
| Filter by priority | ✅ |
| Sort by date | ✅ |

### REST APIs (all JSON, protected routes validate JWT)
| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Create a new user account |
| POST | `/api/auth/login` | Authenticate and return a JWT |
| GET | `/api/tasks` | Retrieve tasks (search / filter / sort / paginate) |
| GET | `/api/tasks/:id` | Retrieve a single task |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/tasks/stats` | *(extra)* Counts per status |
| GET | `/api/auth/users` | *(extra)* Users for task assignment |

### Database
| Requirement | Status |
|---|---|
| Users and Tasks stored in MongoDB Atlas | ✅ |
| Mongoose models with types and validation | ✅ enums, required fields, unique email, email format |
| Relationship: task → assigned user | ✅ `assignedUser: ObjectId ref 'User'`, populated in responses |

### Required React Concepts
| Concept | Where used |
|---|---|
| `useState`, `useEffect` | Dashboard, TaskForm, Login, Register |
| `useMemo` | Dashboard (selected task), ThemeProvider (context value) |
| `useCallback` | All Dashboard handlers passed to memoized children |
| `React.memo` | TaskCard, StatCard, Sidebar, Segmented, Pagination |
| Custom Hooks | `useDebounce`, `useTheme` |
| Context / Redux | Redux Toolkit (`authSlice`, `tasksSlice`) + Context API (theme) |
| Lazy Loading + Suspense | Route-level `React.lazy` with a Suspense loader |
| Validation | Required fields, email format, password rules + confirm, duplicate users, invalid JWT → auto-logout |

### Error Handling
| Code | Scenario handled |
|---|---|
| 404 | Unknown task ID, unknown route |
| 400 | Missing fields, invalid IDs, invalid filter values, duplicate email, wrong credentials |
| Network | Axios interceptor shows a clear "cannot reach the server" message |
| 401 | Missing/invalid/expired token → session cleared, redirect to login |

### Folder Structure
Matches the expected structure:
- `client/src/` → `components/`, `pages/`, `hooks/`, `services/`, `utils/`, `store/`
- `server/` → `controllers/`, `models/`, `routes/`, `middleware/`, `config/`

---

## 5. Bonus Features (4 implemented)

| Feature | Details |
|---|---|
| 🌙 Dark Mode | Toggle in sidebar and login page; persisted; follows system preference by default |
| 🔔 Toast Notifications | Feedback on create, update, delete, complete and logout (`react-hot-toast`) |
| 📄 Pagination | Server-side `page` / `limit` with total count; stats endpoint keeps counts accurate across pages |
| 🐳 Docker | `server/Dockerfile`, `client/Dockerfile` (multi-stage, nginx) and `docker-compose.yml` |

---

## 6. Screenshots

| Login | Dashboard (dark) |
|---|---|
| ![Login](docs/screenshots/login.png) | ![Dashboard dark](docs/screenshots/dashboard-dark.png) |

| New Task | Dashboard (light) |
|---|---|
| ![New task](docs/screenshots/new-task.png) | ![Dashboard light](docs/screenshots/dashboard-light.png) |

---

## 7. How to Evaluate Quickly

1. Open the **live frontend** and click **Use User → Sign In** (allow up to ~50s on the first request).
2. Create a task with **+ New Task**, click the card to view details, tick the circle to complete it, edit it, then delete it.
3. Try the search box, the sidebar lists (status), the priority filter and the date sort.
4. Toggle **Dark / Light** in the sidebar.
5. Import `Taskflow.postman_collection.json` into Postman and run the collection — **Login** stores the token automatically.

Local setup instructions are in the [README](README.md#local-setup).
