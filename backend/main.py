from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from fastapi import FastAPI , HTTPException  # pyright: ignore[reportMissingImports]
from pydantic import BaseModel  # pyright: ignore[reportMissingImports] #to validate data
from database import get_connection
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(title="JobTrack API")  # pyright: ignore[reportMissingImports]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class JobApplication(BaseModel):
    company_name: str
    position: str
    status: str



@app.get("/")
def home():
    return {"message": "Welcome to JobTrack !" ,
            "status": "API is running"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/applications")
def get_applications():
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, company_name, position, status
                FROM applications
                ORDER BY id;
            """)
            rows = cursor.fetchall()

            return [
                {
                    "id": row[0],
                    "company_name": row[1],
                    "position": row[2],
                    "status": row[3]
                }
                for row in rows
            ]


@app.post("/applications")
def create_application(application: JobApplication):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO applications (company_name, position, status)
                VALUES (%s, %s, %s)
                RETURNING id, company_name, position, status;
                """,
                (
                    application.company_name,
                    application.position,
                    application.status
                )
            )

            row = cursor.fetchone()

            return {
                "id": row[0],
                "company_name": row[1],
                "position": row[2],
                "status": row[3]
            }

@app.get("/applications/{application_id}")
def get_application(application_id: int):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, company_name, position, status
                FROM applications
                WHERE id = %s;
                """,
                (application_id,)
            )

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Application not found"
                )

            return {
                "id": row[0],
                "company_name": row[1],
                "position": row[2],
                "status": row[3]
            }   

@app.put("/applications/{application_id}")
def update_application(
    application_id: int,
    updated_application: JobApplication
):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE applications
                SET company_name = %s,
                    position = %s,
                    status = %s
                WHERE id = %s
                RETURNING id, company_name, position, status;
                """,
                (
                    updated_application.company_name,
                    updated_application.position,
                    updated_application.status,
                    application_id
                )
            )

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Application not found"
                )

            return {
                "id": row[0],
                "company_name": row[1],
                "position": row[2],
                "status": row[3]
            }  

@app.delete("/applications/{application_id}")
def delete_application(application_id: int):
    with get_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                DELETE FROM applications
                WHERE id = %s
                RETURNING id;
                """,
                (application_id,)
            )

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Application not found"
                )

            return {
                "message": "Application deleted successfully",
                "id": row[0]
            }  
