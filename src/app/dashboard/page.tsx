"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { EmailList, Email } from '@/components/EmailList'
import { fetchInboxEmails, archiveEmail, deleteEmail } from '@/lib/gmail'
import { ScoreBadge } from './ScoreBadge'
import { getUserScore } from '@/lib/score'
import { useRouter } from 'next/navigation'

export default function DashboardPage({ user, accessToken }: { user: any; accessToken: string }) {
  const [emails, setEmails] = useState<Email[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [score, setScore] = useState<number>(0)
  const [scoreDelta, setScoreDelta] = useState<number>(0)
  const [showBadge, setShowBadge] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError(null)
      try {
        const [emailsRes, scoreRes] = await Promise.all([
          fetchInboxEmails(accessToken, 10),
          getUserScore(user.id),
        ])
        setEmails(emailsRes)
        setScore(scoreRes)
      } catch (err: any) {
        setError(err.message || 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [accessToken, user.id])

  const handleArchive = async (id: string) => {
    setActionLoading(id)
    setError(null)
    try {
      await archiveEmail(accessToken, id)
      setEmails(prev => prev.filter(e => e.id !== id))
      setScore(s => s + 5)
      setScoreDelta(5)
      setShowBadge(true)
      setTimeout(() => setShowBadge(false), 1200)
    } catch (err: any) {
      setError(err.message || 'Failed to archive email')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id)
    setError(null)
    try {
      await deleteEmail(accessToken, id)
      setEmails(prev => prev.filter(e => e.id !== id))
      setScore(s => s + 3)
      setScoreDelta(3)
      setShowBadge(true)
      setTimeout(() => setShowBadge(false), 1200)
    } catch (err: any) {
      setError(err.message || 'Failed to delete email')
    } finally {
      setActionLoading(null)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-0">
      <header className="w-full max-w-2xl flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-8 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm mt-1 truncate">
            Signed in as <span className="font-semibold">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-green-600">Score: {score}</span>
          <form action="/dashboard/logout" method="post">
            <Button type="submit" variant="outline" size="sm">Log out</Button>
          </form>
        </div>
      </header>

      {showOnboarding && (
        <div className="w-full max-w-2xl mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-blue-800 mb-1">Welcome to Inbox Zero Game!</h2>
              <p className="text-blue-700 text-sm">
                Archive emails (+5 pts) or delete them (+3 pts) to earn points. Try to reach Inbox Zero and compete with yourself! Your score is saved and updates in real time.
              </p>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setShowOnboarding(false)}>
              Got it!
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full max-w-2xl mb-4">
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
            {error}
          </div>
        </div>
      )}

      {loading ? (
        <div className="w-full max-w-2xl flex justify-center items-center py-16">
          <svg className="animate-spin h-8 w-8 text-blue-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <EmailList
            emails={emails}
            onArchive={handleArchive}
            onDelete={handleDelete}
            actionLoading={actionLoading}
          />
        </div>
      )}

      <ScoreBadge points={scoreDelta} show={showBadge} />
    </div>
  )
} 