import { useState } from 'react'
import { askLedgerAI } from '../../services/expenseService'
import { Bot, Send, User } from 'lucide-react'

function LedgerAIAssistant({ onExpenseAdded }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!input.trim()) {
      return
    }

    const userMessage = input.trim()

    setMessages((previous) => [
      ...previous,
      {
        role: 'user',
        content: userMessage
      }
    ])

    setInput('')
    setLoading(true)

    try {
      const data = await askLedgerAI(userMessage)

      let aiMessage = ''

      if (data.action === 'CREATE_EXPENSE') {
        const expense = data.expense

        aiMessage = `Added ₹${expense.amount} for ${expense.description}.`

        if (onExpenseAdded) {
          await onExpenseAdded()
        }
      } else if (data.action === 'SPENDING_QUERY') {
        aiMessage = data.answer
      } else {
        aiMessage = 'I could not understand that request.'
      }

      setMessages((previous) => [
        ...previous,
        {
          role: 'ai',
          content: aiMessage
        }
      ])
    } catch (error) {
      setMessages((previous) => [
        ...previous,
        {
          role: 'ai',
          content:
            error.message || 'Unable to process your request.'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-assistant">

      <div className="ai-assistant-header">
        <div className="ai-assistant-title">
          <div className="ai-assistant-icon">
            <Bot size={20} />
          </div>

          <div>
            <h3>LedgerAI Assistant</h3>
            <span>Ask about your expenses</span>
          </div>
        </div>
      </div>

      <div className="ai-chat">

        {messages.length === 0 && (
          <div className="ai-empty-state">
            <Bot size={28} />
            <h4>How can I help?</h4>
            <p>
              Ask me to add an expense or analyze your spending.
            </p>
            <div className="ai-suggestions">
                <span>“₹450 lunch today”</span>
                <span>“How much did I spend on food?”</span>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`ai-message ${
              message.role === 'user'
                ? 'ai-message-user'
                : 'ai-message-assistant'
            }`}
          >
            <div className="ai-message-icon">
              {message.role === 'user' ? (
                <User size={16} />
              ) : (
                <Bot size={16} />
              )}
            </div>

            <div className="ai-message-content">
              <strong>
                {message.role === 'user' ? 'You' : 'LedgerAI'}
              </strong>

              <p>{message.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="ai-message ai-message-assistant">
            <div className="ai-message-icon">
              <Bot size={16} />
            </div>

            <div className="ai-message-content">
              <strong>LedgerAI</strong>
              <p>Thinking...</p>
            </div>
          </div>
        )}

      </div>

      <form
        className="ai-input-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Add an expense or ask about your spending..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </form>

    </div>
  )
}

export default LedgerAIAssistant