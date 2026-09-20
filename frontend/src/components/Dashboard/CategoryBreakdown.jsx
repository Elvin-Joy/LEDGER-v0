import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { getExpenseSummary } from '../../services/expenseService'

function CategoryBreakdown({ refreshTrigger }) {
  const [categories, setCategories] = useState({})
  const [loading, setLoading] = useState(true)

  const colors = [
    '#8b5cf6',
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#ec4899',
    '#06b6d4',
  ]

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await getExpenseSummary()
        setCategories(data.by_category)
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [refreshTrigger])

  if (loading) {
    return <p>Loading categories...</p>
  }

  const chartData = Object.entries(categories).map(
    ([category, amount]) => ({
      name: category,
      value: Number(amount),
    })
  )

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  )

  if (chartData.length === 0) {
    return (
      <div className="category-breakdown">
        <h3>Spending by Category</h3>
        <p>No category data available.</p>
      </div>
    )
  }

  return (
    <div className="category-breakdown">
      <h3>Spending by Category</h3>

      <div className="category-chart">

        {/* Donut Chart */}
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toFixed(2)}`
                }
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center of donut */}
          <div className="chart-center">
            <span>₹{total.toFixed(2)}</span>
            <small>Total</small>
          </div>
        </div>

        {/* Category Legend */}
        <div className="category-legend">
          {chartData.map((item, index) => {
            const percentage =
              (item.value / total) * 100

            return (
              <div
                className="category-legend-item"
                key={item.name}
              >
                <div className="category-name">
                  <span
                    className="category-dot"
                    style={{
                      backgroundColor:
                        colors[index % colors.length],
                    }}
                  />

                  <span>{item.name}</span>
                </div>

                <span>
                  ₹{item.value.toFixed(2)}
                </span>

                <small>
                  {percentage.toFixed(1)}%
                </small>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}

export default CategoryBreakdown