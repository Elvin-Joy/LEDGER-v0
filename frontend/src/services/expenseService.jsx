const API_URL = 'http://127.0.0.1:8000'

function getAuthHeaders() {
  const token = localStorage.getItem('access_token')

  return {
    Authorization: `Bearer ${token}`,
  }
}

export async function getExpenses(
  category = '',
  sortBy = 'id',
  order = 'desc'
) {
  const params = new URLSearchParams()

  if (category) {
    params.append('category', category)
  }

  params.append('sort_by', sortBy)
  params.append('order', order)
  params.append('skip', '0')
  params.append('limit', '10')

  const response = await fetch(
    `${API_URL}/expenses/?${params.toString()}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Could not load expenses')
  }

  return data
}

export async function createExpense(
  amount,
  category,
  description,
  date
) {
  const response = await fetch(`${API_URL}/expenses/`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      category,
      description,
      date,
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.detail || 'Could not create expense')
  }

  return data
}

export async function getExpenseSummary() {
  const response = await fetch(
    `${API_URL}/expenses/summary`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Could not load expense summary'
    )
  }

  return data
}

export async function deleteExpense(expenseId) {
  const response = await fetch(
    `${API_URL}/expenses/${expenseId}`,
    {
      method: 'DELETE',
      headers: getAuthHeaders(),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Could not delete expense'
    )
  }

  return data
}

export async function askLedgerAI(question) {
  const response = await fetch(
    `${API_URL}/ai/ask`,
    {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
      }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Failed to get AI response'
    )
  }

  return data
}