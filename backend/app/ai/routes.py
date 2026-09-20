from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.db.database import get_db
from app.db.models import Expense, User
from app.auth.security import get_current_user
from app.ai.schemas import (
    NaturalLanguageExpenseRequest,
    SpendingQuestionRequest
)
from app.ai.gemini_service import parse_expense_text, analyze_spending,parse_user_input

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)
@router.post("/expense")
def create_expense_from_text(
    request: NaturalLanguageExpenseRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense_data = parse_expense_text(request.text)
    if expense_data.action != "CREATE_EXPENSE":
        raise HTTPException(
            status_code=400,
            detail="Unsupported AI action"
        )

    allowed_categories = {
        "Food",
        "Transportation",
        "Shopping",
        "Bills",
        "Entertainment",
        "Health",
        "Other"
    }

    if expense_data.category not in allowed_categories:
        raise HTTPException(
            status_code=400,
            detail="Invalid expense category"
        )

    new_expense = Expense(
        user_id=current_user.id,
        amount=expense_data.amount,
        category=expense_data.category,
        description=expense_data.description,
        date=expense_data.date
    )

    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return new_expense


@router.post("/spending")
def ask_spending_question(
    request: SpendingQuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expenses = db.query(Expense).filter(
        Expense.user_id == current_user.id
    ).all()

    expense_data = [
        {
            "amount": float(expense.amount),
            "category": expense.category,
            "description": expense.description,
            "date": str(expense.date)
        }
    for expense in expenses
]

    answer = analyze_spending(
        request.question,
        expense_data
    )

    return {
        "question": request.question,
        "answer": answer
    }

@router.post("/ask")
def ask_ledger_ai(
    request: SpendingQuestionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    command = parse_user_input(request.question)

    if command.action == "CREATE_EXPENSE":
        if command.amount is None:
            raise HTTPException(
                status_code=400,
                detail="AI could not determine the expense amount"
            )

        if command.category is None:
            raise HTTPException(
                status_code=400,
                detail="AI could not determine the expense category"
            )

        if command.description is None:
            raise HTTPException(
                status_code=400,
                detail="AI could not determine the expense description"
            )

        if command.date is None:
            raise HTTPException(
                status_code=400,
                detail="AI could not determine the expense date"
            )

        allowed_categories = {
            "Food",
            "Transportation",
            "Shopping",
            "Bills",
            "Entertainment",
            "Health",
            "Other"
        }

        if command.category not in allowed_categories:
            raise HTTPException(
                status_code=400,
                detail="Invalid expense category"
            )

        new_expense = Expense(
            user_id=current_user.id,
            amount=command.amount,
            category=command.category,
            description=command.description,
            date=command.date
        )

        db.add(new_expense)
        db.commit()
        db.refresh(new_expense)

        return {
            "action": "CREATE_EXPENSE",
            "expense": new_expense
        }

    elif command.action == "SPENDING_QUERY":
        expenses = db.query(Expense).filter(
            Expense.user_id == current_user.id
        ).all()

        expense_data = [
            {
                "amount": float(expense.amount),
                "category": expense.category,
                "description": expense.description,
                "date": str(expense.date)
            }
            for expense in expenses
        ]

        answer = analyze_spending(
            command.question,
            expense_data
        )

        return {
            "action": "SPENDING_QUERY",
            "answer": answer
        }

    else:
        raise HTTPException(
            status_code=400,
            detail="Unsupported AI action"
        )