import ExpenseItem from './ExpenseItem'
import Loading from '../common/Loading'

function ExpenseList({
  expenses,
  loading,
  onExpenseDeleted,
}) {
  if (loading) {
    return <Loading />
  }

  if (expenses.length === 0) {
    return <p>No expenses found.</p>
  }

  return (
    <div className="expense-list">
      <h3>Recent Expenses</h3>

      <div className="expense-table">
        <div className="expense-table-header">
          <span>Date</span>
          <span>Category</span>
          <span>Description</span>
          <span>Amount</span>
          <span>Action</span>
        </div>

        {expenses.map((expense) => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            onExpenseDeleted={onExpenseDeleted}
          />
        ))}
      </div>
    </div>
  )
}

export default ExpenseList