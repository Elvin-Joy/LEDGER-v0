
from datetime import date
from decimal import Decimal

from pydantic import BaseModel, Field


class ExpenseCreate(BaseModel):
    amount: Decimal = Field(gt=0)
    category: str
    description: str
    date: date


class ExpenseResponse(BaseModel):
    id: int
    amount: Decimal
    category: str
    description: str
    date: date

    class Config:
        from_attributes = True
