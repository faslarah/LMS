# Learning Management System

A full-stack learning management system with a React frontend and a Django REST API. It supports student, instructor, and administrator workflows, with PostgreSQL for application data.

## Features

- **Students:** browse courses and instructors, enroll, follow lessons, track progress, review courses, and view certificates.
- **Instructors:** create and manage courses and lessons, and review student, course, and review analytics.
- **Administrators:** manage users, courses, categories, and instructor applications.
- **Authentication:** registration, login, and JWT-based API authentication.

## Tech stack

- Frontend: React 19, React Router, Vite, Axios
- Backend: Python, Django 4.2, Django REST Framework, Simple JWT
- Database: PostgreSQL 15
- Local orchestration: Docker Compose

## Quick start with Docker Compose

### Prerequisites

- Docker with the Compose plugin
- Git

1. Clone the repository and enter its directory.
2. Create a `.env` file in the repository root with values for the settings Django and PostgreSQL require:

   ```dotenv
   SECRET_KEY=replace-with-a-long-random-secret
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1

   DB_NAME=lms
   DB_USER=lms
   DB_PASSWORD=replace-with-a-local-password
   DB_HOST=db
   DB_PORT=5432
   ```

   Keep real credentials out of version control. `DB_HOST=db` is the Compose service name; use `localhost` if you run Django directly on your machine while PostgreSQL is in Docker.

3. Build and start the services:

   ```bash
   docker compose up --build
   ```

4. In another terminal, apply database migrations:

   ```bash
   docker compose exec backend python core/manage.py migrate
   ```

5. Optionally create an administrator account:

   ```bash
   docker compose exec backend python core/manage.py createsuperuser
   ```

Open the frontend at [http://localhost:5173](http://localhost:5173), the API at [http://localhost:8000/api/](http://localhost:8000/api/), and Django admin at [http://localhost:8000/admin/](http://localhost:8000/admin/).

To stop the services, press `Ctrl+C` in the Compose terminal. To run them in the background, use `docker compose up --build -d` and stop them later with `docker compose down`.

## Local development

The Compose setup is the simplest way to run the full stack. To run the frontend separately:

```bash
cd frontend/lms-app
npm install
npm run dev
```

For frontend checks and a production build:

```bash
npm run lint
npm run build
```

To run Django outside Docker, install `backend/requirements.txt`, configure `.env` with `DB_HOST=localhost` and the other settings above, ensure PostgreSQL is running, then run:

```bash
cd backend
python -m pip install -r requirements.txt
python core/manage.py migrate
python core/manage.py runserver
```

## API areas

- `/api/auth/` — registration, login, profiles, instructor applications, and administration of users and applications
- `/api/courses/` — courses, categories, sections, enrollments, wishlists, reviews, discussions, certificates, and instructor tools

The frontend currently targets the API at `http://localhost:8000/api`.
