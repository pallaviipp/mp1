import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Function to connect to PostgreSQL
def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASS")
    )

