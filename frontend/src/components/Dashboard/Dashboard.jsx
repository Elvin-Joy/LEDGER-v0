import { useEffect, useState } from 'react'
import {LogOut } from 'lucide-react'

import { getExpenses } from '../../services/expenseService'
import { logoutUser } from '../../services/authService'

import SummaryCards from './SummaryCards'
import CategoryBreakdown from './CategoryBreakdown'
import LedgerAIAssistant from '../AI/LedgerAIAssistant'
import ExpenseFilters from '../Expenses/ExpenseFilters'
import ExpenseList from '../Expenses/ExpenseList'

function Dashboard({ onLogout }) {
  const [expenses, setExpenses] = useState([])
  const [loadingExpenses, setLoadingExpenses] = useState(false)
  const [summaryRefreshKey, setSummaryRefreshKey] = useState(0)

  const fetchExpenses = async (
    category = '',
    sortBy = 'id',
    order = 'desc'
  ) => {
    setLoadingExpenses(true)

    try {
      const data = await getExpenses(
        category,
        sortBy,
        order
      )

      setExpenses(data)
    } catch (error) {
      alert(error.message)
    } finally {
      setLoadingExpenses(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const handleExpenseAdded = async () => {
    await fetchExpenses()

    setSummaryRefreshKey(
      (previous) => previous + 1
    )
  }

  const handleExpenseDeleted = async () => {
    await fetchExpenses()

    setSummaryRefreshKey(
      (previous) => previous + 1
    )
  }

  const handleLogout = () => {
    logoutUser()
    onLogout()
  }

  return (
    <div className="dashboard-card">

      {/* Top Navbar */}
      <div className="dashboard-navbar">

        <div className="dashboard-brand">
          <div>
            <h2>LedgerAI</h2>
            <span>AI-powered expense tracker</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="logout-button"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>

      </div>

      {/* Summary */}
      <SummaryCards
        refreshTrigger={summaryRefreshKey}
      />

      {/* Middle Row */}
      <div className="dashboard-middle">
        <CategoryBreakdown
          refreshTrigger={summaryRefreshKey}
        />

        <ExpenseFilters
          onFilterChange={({ category, sortBy, order }) => {
            fetchExpenses(
              category,
              sortBy,
              order
            )
          }}
        />
      </div>

      {/* Recent Expenses */}
      <ExpenseList
        expenses={expenses}
        loading={loadingExpenses}
        onExpenseDeleted={handleExpenseDeleted}
      />

      {/* LedgerAI Chat */}
      <LedgerAIAssistant
        onExpenseAdded={handleExpenseAdded}
      />

    </div>
  )
}

export default Dashboard