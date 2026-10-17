# JobTrack – Job Application Tracker

JobTrack is a full-stack web application that helps users organize and track their job applications in one place. It provides a dashboard to manage applications and monitor their current status.

## Features

- **Dashboard:** View job applications and summary statistics.
- **Add Applications:** Record a company name, job position, and application status.
- **View Applications:** Display saved applications.
- **Edit Applications:** Update application details and status.
- **Delete Applications:** Remove applications that are no longer needed.
- **Database Integration:** Store application records in PostgreSQL through a FastAPI backend.

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS

**Backend**
- Python
- FastAPI
- Psycopg
- REST API

**Database**
- PostgreSQL

**Tools**
- Git and GitHub
- VS Code
- pgAdmin

## Project Structure

```text
JobTrack/
├── backend/
│   ├── main.py
│   ├── database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the project:

- Python
- Node.js and npm
- PostgreSQL

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/JobTrack.git
cd JobTrack
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Configure the Backend

Open a terminal in the `backend` folder.

Create and activate a virtual environment on Windows:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

Install the backend dependencies:

```powershell
pip install -r requirements.txt
```

Create a `.env` file inside `backend/` with your local PostgreSQL connection settings:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=jobtrack
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password
```

Replace the example credentials with your own. **Never commit your `.env` file or database password to GitHub.**

Create the `applications` table in your PostgreSQL database:

```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Applied'
);
```

Start the backend:

```powershell
uvicorn main:app --reload
```

The API runs at `http://127.0.0.1:8000`.

Explore the interactive API documentation at `http://127.0.0.1:8000/docs`.

### 3. Run the Frontend

Open a separate terminal in the `frontend` folder.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed in your terminal, usually `http://localhost:5173`.

## What I Learned

- Building a frontend with React.
- Creating RESTful APIs using FastAPI.
- Connecting a backend to PostgreSQL.
- Implementing CRUD operations.
- Handling API requests between frontend and backend.
- Using environment variables to protect database credentials.
- Managing source code with Git and GitHub.

## Future Improvements

- Search and filter job applications.
- Add user authentication.
- Improve form validation and error handling.
- Deploy the application online.

## Author

**Retaj Mahmoud Ali**

[GitHub](https://github.com/Reta03)
