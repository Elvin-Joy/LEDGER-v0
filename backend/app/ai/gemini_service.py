import os
from datetime import date as date_type

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel
from typing import Optional

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


class GeminiExpense(BaseModel):
    action: str
    amount: float
    category: str
    description: str
    date: date_type

def parse_expense_text(text: str) -> GeminiExpense:
    today = date_type.today()
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=f"""
Convert the user's expense description into structured expense data.
Today's date is: {today}

User input:
{text}

Rules:
- action must be "CREATE_EXPENSE"
- category must be one of:
  Food, Transportation, Shopping, Bills,
  Entertainment, Health, Other
- description should be a short description of the expense
- date must be today's date or an explicitly mentioned past date
- never use a future date
""",
        config={
            "response_mime_type": "application/json",
            "response_schema": GeminiExpense,
        },
    )

    return GeminiExpense.model_validate_json(response.text)

def analyze_spending(question: str, expenses: list[dict]) -> str:
    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=f"""
You are the AI assistant for LedgerAI.

Answer the user's spending question using ONLY the expense data provided below.

User question:
{question}

Expense data:
{expenses}

Rules:
- Do not invent expenses or amounts.
- Do not generate SQL.
- Give a concise, clear answer.
- If the data does not contain enough information to answer, say so.
- All amounts are in Indian Rupees (INR).
- Always use the ₹ symbol for monetary amounts.
- Never use $, USD, or any other currency.
""",
    )

    return response.text




class GeminiCommand(BaseModel):
    action: str
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[date_type] = None
    question: Optional[str] = None


def parse_user_input(text: str) -> GeminiCommand:
    today = date_type.today()

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=f"""
You are the command parser for LedgerAI.

Today's date is: {today}

User input:
{text}

Determine what the user wants.

If the user is describing a new expense, use:
action = "CREATE_EXPENSE"

For an expense:
- amount must be the expense amount
- category must be one of:
  Food, Transportation, Shopping, Bills,
  Entertainment, Health, Other
- description should be short
- date must be today or an explicitly mentioned past date
- never use a future date

If the user is asking about their spending, use:
action = "SPENDING_QUERY"

For a spending question:
- question should contain the user's question
- amount, category, description and date should be null

Do not generate SQL.
Do not invent information.
""",
        config={
            "response_mime_type": "application/json",
            "response_schema": GeminiCommand,
        },
    )

    return GeminiCommand.model_validate_json(response.text)