import React from 'react'

export interface Email {
  id: string
  snippet?: string
  payload?: {
    headers?: { name: string; value: string }[]
  }
}

interface EmailListProps {
  emails: Email[]
  onArchive?: (id: string) => void
  onDelete?: (id: string) => void
  actionLoading?: string | null
}

function getHeader(headers: { name: string; value: string }[] | undefined, key: string) {
  return headers?.find(h => h.name.toLowerCase() === key.toLowerCase())?.value || ''
}

export const EmailList: React.FC<EmailListProps> = ({ emails, onArchive, onDelete, actionLoading }) => {
  return (
    <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white shadow">
      {emails.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No emails found.</div>
      ) : (
        emails.map(email => {
          const from = getHeader(email.payload?.headers, 'From')
          const subject = getHeader(email.payload?.headers, 'Subject')
          const date = getHeader(email.payload?.headers, 'Date')
          return (
            <div key={email.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 hover:bg-gray-50 transition">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{subject || '(No Subject)'}</div>
                <div className="text-sm text-gray-600 truncate">{from}</div>
                <div className="text-xs text-gray-400 mt-1">{date && new Date(date).toLocaleString()}</div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs font-semibold transition disabled:opacity-60"
                  onClick={() => onArchive?.(email.id)}
                  title="Archive"
                  disabled={actionLoading === email.id}
                >
                  {actionLoading === email.id ? (
                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : null}
                  Archive
                </button>
                <button
                  className="inline-flex items-center px-3 py-1.5 rounded bg-red-100 text-red-700 hover:bg-red-200 text-xs font-semibold transition disabled:opacity-60"
                  onClick={() => onDelete?.(email.id)}
                  title="Delete"
                  disabled={actionLoading === email.id}
                >
                  {actionLoading === email.id ? (
                    <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : null}
                  Delete
                </button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
} 