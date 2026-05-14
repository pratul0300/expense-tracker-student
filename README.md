# Student Expense Tracker (generated)

## If you see “how to run” on GitHub instead of the app

The **markdown instructions in this file are not the hosted app**. GitHub shows this README on the **repository** page.

- **Open the real site at:** `https://<your-username>.github.io/<repository-name>/`  
  (example: `https://pratul0300.github.io/expense-tracker-student/`)
- **Pages must use the built site:** **Settings → Pages → Build and deployment → Branch: `gh-pages` → Folder: `/ (root)` → Save.**  
  If **Branch** is **`main`**, you will only see this README (there is no `index.html` at the repo root).

After the “Deploy frontend to GitHub Pages” workflow succeeds, wait a minute and hard-refresh the **`.github.io`** URL.

---

This folder contains a complete Spring Boot 3 + React (Vite, JS/JSX) implementation.

> **Note:** This agent could not write into `~/.cursor/projects/empty-window` due to OS-level permission restrictions on that directory. Copy this folder into your Cursor workspace root if needed.

## Quick start

### Backend

```bash
cd backend
export JAVA_HOME="$(/usr/libexec/java_home -v 21)"  # macOS example
./mvnw clean package -DskipTests
./mvnw spring-boot:run
```

- API base: `http://localhost:8080/api`
- H2 console: `http://localhost:8080/h2-console` (see `application.properties` for JDBC URL)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite dev server proxies `/api` to `http://localhost:8080`.

## Project tree (high level)

```
backend/
  pom.xml
  mvnw
  .mvn/wrapper/
  src/main/java/com/expensetracker/
  src/main/resources/application.properties
frontend/
  package.json
  vite.config.js
  src/
```

