import { useState } from 'react'

function ExpenseFilters({ onFilterChange }) {
  const [category, setCategory] = useState('')
  const [sortBy, setSortBy] = useState('id')
  const [order, setOrder] = useState('desc')

  const handleApply = () => {
    onFilterChange({
      category,
      sortBy,
      order,
    })
  }

  const handleReset = () => {
    setCategory('')
    setSortBy('id')
    setOrder('desc')

    onFilterChange({
      category: '',
      sortBy: 'id',
      order: 'desc',
    })
  }

  return (
    <div className="expense-filters">
      <h3>Filter & Sort</h3>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>
        <option value="Food">Food</option>
        <option value="Transportation">Transportation</option>
        <option value="Shopping">Shopping</option>
        <option value="Bills">Bills</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Health">Health</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="id">Latest</option>
        <option value="amount">Amount</option>
        <option value="date">Date</option>
      </select>

      <select
        value={order}
        onChange={(e) => setOrder(e.target.value)}
      >
        <option value="desc">Descending</option>
        <option value="asc">Ascending</option>
      </select>

      <button type="button" onClick={handleApply}>
        Apply
      </button>

      <button type="button" onClick={handleReset}>
        Reset
      </button>
    </div>
  )
}

export default ExpenseFilters