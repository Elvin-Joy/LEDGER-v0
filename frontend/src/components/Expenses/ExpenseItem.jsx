import { useState } from 'react'
import { deleteExpense } from '../../services/expenseService'

function ExpenseItem({ expense, onExpenseDeleted }) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this expense?'
    )

    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)

      await deleteExpense(expense.id)

      onExpenseDeleted()
    } catch (error) {
      alert(error.message)
      setDeleting(false)
    }
  }

  return (
    <div className="expense-item">
      <div className="expense-date">
        {expense.date}
      </div>

      <div className="expense-category">
        {expense.category}
      </div>

      <div className="expense-description">
        {expense.description}
      </div>

      <div className="expense-amount">
        ₹{expense.amount}
      </div>

      <div className="expense-action">
        <button
          type="button"
          className="delete-button"
          onClick={handleDelete}
          disabled={deleting}
          title="Delete expense"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default ExpenseItem