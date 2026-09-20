import { useEffect, useState } from 'react'
import { getExpenseSummary } from '../../services/expenseService'
import {
  Wallet,
  FileText,
  TrendingUp
} from 'lucide-react'

function SummaryCards({ refreshTrigger }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getExpenseSummary()
        setSummary(data)
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [refreshTrigger])

  if (loading) {
    return <p>Loading summary...</p>
  }

  if (!summary) {
    return <p>Could not load summary.</p>
  }

  return (
    <div className="summary-cards">

      {/* Total Spending */}
      <div className="summary-card summary-card-spending">
        <div className="summary-icon">
          <Wallet size={22} />
        </div>

        <div className="summary-content">
          <h3>Total Spending</h3>
          <p>₹{summary.total_spending}</p>
        </div>
      </div>

      {/* Expenses */}
      <div className="summary-card summary-card-expenses">
        <div className="summary-icon">
          <FileText size={22} />
        </div>

        <div className="summary-content">
          <h3>Expenses</h3>
          <p>{summary.expense_count}</p>
        </div>
      </div>

      {/* Highest Expense */}
      <div className="summary-card summary-card-highest">
        <div className="summary-icon">
          <TrendingUp size={22} />
        </div>

        <div className="summary-content">
          <h3>Highest Expense</h3>
          <p>₹{summary.highest_expense}</p>
        </div>
      </div>

    </div>
  )
}

export default SummaryCards