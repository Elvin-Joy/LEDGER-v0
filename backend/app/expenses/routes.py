from fastapi import APIRouter, Depends, HTTPException, Query
from datetime import date
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.db.models import Expense, User
from app.auth.security import get_current_user
from app.expenses.schemas import ExpenseCreate, ExpenseResponse, ExpenseSummaryResponse

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

@router.post("/", response_model=ExpenseResponse)
def create_expense(
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

@router.get("/", response_model=list[ExpenseResponse])
def get_expenses(
    category: str | None = None,
    date: date | None = None,
    sort_by: str | None = Query(
        default=None,
        pattern="^(amount|date|id)$"
    ),
    order: str = Query(
        default="desc",
        pattern="^(asc|desc)$"
    ),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expenses_query = db.query(Expense).filter(
        Expense.user_id == current_user.id
    )

    if category:
        expenses_query = expenses_query.filter(
            Expense.category == category
        )


    if date:
        expenses_query = expenses_query.filter(
            Expense.date == date
    )

    if sort_by == "amount":
        expenses_query = expenses_query.order_by(
            Expense.amount.desc() if order == "desc" else Expense.amount.asc()
    )

    elif sort_by == "date":
        expenses_query = expenses_query.order_by(
            Expense.date.desc() if order == "desc" else Expense.date.asc()
    )

    elif sort_by == "id":
        expenses_query = expenses_query.order_by(
            Expense.id.desc() if order == "desc" else Expense.id.asc()
    )

    expenses = expenses_query.offset(skip).limit(limit).all()

    return expenses

@router.get("/summary", response_model=ExpenseSummaryResponse)
def get_expense_summary(
    start_date: date | None = None,
    end_date: date | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expenses_query = db.query(Expense).filter(
        Expense.user_id == current_user.id
    )

    if start_date:
        expenses_query = expenses_query.filter(
            Expense.date >= start_date
        )
    if end_date:
        expenses_query = expenses_query.filter(
            Expense.date <= end_date
        )
    expenses = expenses_query.all()

    total_spending = sum(expense.amount for expense in expenses)
    expense_count = len(expenses)
    highest_expense = max(
        (expense.amount for expense in expenses),
        default=0
    )

    by_category = {}

    for expense in expenses:
        if expense.category not in by_category:
            by_category[expense.category] = 0

        by_category[expense.category] += expense.amount
    return {
        "total_spending": total_spending,
        "expense_count": expense_count,
        "highest_expense": highest_expense,
        "by_category": by_category
    }

@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    return expense


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(
    expense_id: int,
    expense_data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    expense.amount = expense_data.amount
    expense.category = expense_data.category
    expense.description = expense_data.description
    expense.date = expense_data.date

    db.commit()
    db.refresh(expense)

    return expense



@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id
    ).first()

    if expense is None:
        raise HTTPException(
            status_code=404,
            detail="Expense not found"
        )

    db.delete(expense)
    db.commit()

    return {
        "message": "Expense deleted successfully"
    }