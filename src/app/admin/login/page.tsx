'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
	const router = useRouter()
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const res = await fetch('/api/admin/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ password }),
			})
			if (!res.ok) {
				const j = await res.json().catch(() => ({}))
				throw new Error(j.error || 'Login failed')
			}
			router.push('/admin')
		} catch (e: any) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
			<div className="w-full max-w-md rounded-2xl shadow-xl bg-white overflow-hidden">
				<div className="px-8 pt-8 pb-4 bg-emerald-600">
					<h1 className="text-white text-2xl font-bold">Admin Console</h1>
					<p className="text-emerald-50 text-sm mt-1">Sign in to manage schools</p>
				</div>
				<form onSubmit={handleSubmit} className="p-8 space-y-4">
					<label className="block text-sm font-medium text-emerald-900">Admin Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-emerald-500 text-emerald-900"
						placeholder="••••••••"
						required
					/>
					{error && <div className="text-red-600 text-sm">{error}</div>}
					<button
						type="submit"
						disabled={loading}
						className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-lg transition"
					>
						{loading ? 'Signing in...' : 'Sign in'}
					</button>
				</form>
			</div>
		</div>
	)
}
