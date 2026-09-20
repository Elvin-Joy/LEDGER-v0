import { useState } from 'react'
import { createExpense } from '../../services/expenseService'

function getToday() {
  return new Date().toLocaleDateString('en-CA')
}

function AddExpense({ onExpenseAdded }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [description, setDescription] = useState('')
  const [expenseDate, setExpenseDate] = useState(getToday())

  const handleSubmit = async () => {
    if (!amount || !description || !expenseDate) {
      alert('Please fill in all expense fields')
      return
    }

    try {
      await createExpense(
        amount,
        category,
        description,
        expenseDate
      )

      alert('Expense added successfully!')

      setAmount('')
      setCategory('Food')
      setDescription('')
      setExpenseDate(getToday())

      onExpenseAdded()
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="expense-form">
      <h3>Add Expense</h3>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>

      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={expenseDate}
        max={getToday()}
        onChange={(e) => setExpenseDate(e.target.value)}
      />

      <button type="button" onClick={handleSubmit}>
        Add Expense
      </button>
    </div>
  )
}

export default AddExpense