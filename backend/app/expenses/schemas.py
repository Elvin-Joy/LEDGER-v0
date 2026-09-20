
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field, field_validator


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(
        gt=0,
        max_digits=10,
        decimal_places=2
    )
    category: str = Field(
        min_length=1,
        max_length=100
    )
    description: str = Field(
        min_length=1,
        max_length=500
    )
    date: date
    @field_validator("date")
    @classmethod
    def validate_date(cls, value):
        from datetime import date as date_type

        if value > date_type.today():
            raise ValueError("Expense date cannot be in the future")

        return value


class ExpenseResponse(BaseModel):
    id: int
    amount: Decimal
    category: str
    description: str
    date: date

    class Config:
        from_attributes = True

class ExpenseSummaryResponse(BaseModel):
    total_spending: Decimal
    expense_count: int
    highest_expense: Decimal
    by_category: dict[str, Decimal]