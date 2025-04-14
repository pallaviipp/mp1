from fastapi import FastAPI
from db import get_db_connection
from models import Expense

app = FastAPI()

# Home route
@app.get("/")
def home():
    return {"message": "Welcome to the Expense Tracker API"}

# Add a new expense
@app.post("/add_expense/")
def add_expense(expense: Expense):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO expenses (user_id, category, amount, date) VALUES (%s, %s, %s, %s)",
        (expense.user_id, expense.category, expense.amount, expense.date)
    )
    conn.commit()
    cur.close()
    conn.close()
    return {"message": "Expense added successfully"}

# Fetch all expenses for a user
@app.get("/expenses/{user_id}")
def get_expenses(user_id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM expenses WHERE user_id = %s", (user_id,))
    expenses = cur.fetchall()
    cur.close()
    conn.close()
    return {"expenses": expenses}
