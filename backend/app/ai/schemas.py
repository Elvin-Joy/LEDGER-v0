from pydantic import BaseModel, Field


class NaturalLanguageExpenseRequest(BaseModel):
    text: str = Field(
        min_length=1,
        max_length=500
    )

class SpendingQuestionRequest(BaseModel):
    question: str = Field(
        min_length=1,
        max_length=500
    )