# CareerCompass

CareerCompass is a structured placement preparation platform designed to logically guide students through tech domains. Features include domains, stages (roadmaps), leaderboards, and a community search filter.

## Architecture

- **Backend**: Django & Django REST Framework (DRF) storing relational models on PostgreSQL (for production). Utilizes SimpleJWT for authentication and locmem (for cache support on Leaderboards).
- **Frontend**: React (Vite.js) providing a performant SPA connected to DRF via Axios interceptors storing tokens locally. 
- **Business Logic Integration**: Logic is heavily driven by the User model (`switch_domain`, `get_progress_percentage`) and Progress model (`complete_stage`, unlock next logic).

## Role System

Three unique roles via Custom User Model extension:
1. **Admin**: (Django Admin panel usage) Cannot participate in leaderboards. Configures Domains and Stages. Mentors seniors.
2. **Student**: Regular learners who select one domain and complete ordered technical stages sequentially. Leaderboard visibility control enabled.
3. **Senior**: View domain specific student data, cannot participate in leaderboards. Mentors role.

## API Design

- **Authentication**: `/api/token/` and `/api/token/refresh/` for JWTs.
- **Account & Profile**: `/api/register/` (creation), `/api/profile/` (GET and PATCH) for updating visibility rules.
- **Domains & Stages**: `/api/domains/` (list domains), `/api/domains/select/` (student selection post), `/api/stages/<id>/complete/` (completion & unlock next stage post).
- **Analytics & Leaderboard**: `/api/dashboard/` (personal summary roadmap), `/api/leaderboard/` (cached sorted domain rankings).
- **Community**: `/api/community/?domain=&search=` for directory searching and filtering.

## Setup Instructions

### Backend (Django)
1. `cd backend`
2. `python -m venv venv` and activate it.
3. `pip install -r requirements.txt` (or manually install django djangorestframework djangorestframework-simplejwt psycopg2-binary django-cors-headers).
4. `python manage.py migrate`
5. `python manage.py createsuperuser`
6. `python manage.py runserver`

### Frontend (React / Vite)
1. `cd frontend`
2. `npm install`
3. `npm run dev`
