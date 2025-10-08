"use client"

import { useEffect, useState } from 'react'

type School = {
	id: number
	name: string
	address?: string
	city?: string
	state?: string
	country?: string
}

export function ManageSchoolsClient() {
	const [schools, setSchools] = useState<School[]>([])
	const [form, setForm] = useState({ name: '', address: '', city: '', state: '', country: 'India' })
	const [message, setMessage] = useState<string | null>(null)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		refreshSchools().catch(() => {})
	}, [])

	async function refreshSchools() {
		try {
			setError(null)
			const res = await fetch('/api/schools')
			if (!res.ok) throw new Error('Failed to load schools')
			const data = await res.json()
			setSchools(data.schools ?? [])
		} catch (e: any) {
			setError(e.message)
		}
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		setMessage(null)
		setError(null)
		try {
			if (!form.name.trim()) throw new Error('Name is required')
			const res = await fetch('/api/schools', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})
			if (!res.ok) {
				const j = await res.json().catch(() => ({}))
				throw new Error(j.error || 'Failed to create school')
			}
			setForm({ name: '', address: '', city: '', state: '', country: 'India' })
			setMessage('School created')
			await refreshSchools()
		} catch (e: any) {
			setError(e.message)
		}
	}

	async function logoutAdmin() {
		await fetch('/api/admin/logout', { method: 'POST' })
		window.location.href = '/admin/login'
	}

	return (
		<div className="max-w-5xl mx-auto p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold text-emerald-900">Admin - Manage Schools</h1>
				<button onClick={logoutAdmin} className="text-sm text-emerald-700 underline">Logout</button>
			</div>

			{message && <p className="text-emerald-700 mb-2">{message}</p>}
			{error && <p className="text-red-600 mb-2">{error}</p>}

			<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 border p-4 rounded-xl bg-white shadow">
				<div className="md:col-span-2">
					<label className="text-sm text-emerald-900">School name</label>
					<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded px-3 py-2 text-emerald-900" required />
				</div>
				<div>
					<label className="text-sm text-emerald-900">City</label>
					<input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full border rounded px-3 py-2 text-emerald-900" />
				</div>
				<div>
					<label className="text-sm text-emerald-900">State</label>
					<input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full border rounded px-3 py-2 text-emerald-900" />
				</div>
				<div className="md:col-span-2">
					<label className="text-sm text-emerald-900">Address</label>
					<input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full border rounded px-3 py-2 text-emerald-900" />
				</div>
				<div>
					<label className="text-sm text-emerald-900">Country</label>
					<input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full border rounded px-3 py-2 text-emerald-900" />
				</div>
				<div className="md:col-span-2">
					<button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded">Add School</button>
				</div>
			</form>

			<h2 className="text-xl font-semibold mt-6 mb-2 text-emerald-900">Existing Schools</h2>
			<div className="space-y-2">
				{schools.map(s => (
					<div key={s.id} className="border rounded p-3 bg-white shadow-sm">
						<div className="font-medium text-emerald-900">{s.name}</div>
						<div className="text-sm text-emerald-800">{[s.city, s.state, s.country].filter(Boolean).join(', ')}</div>
					</div>
				))}
				{schools.length === 0 && <div className="text-sm text-emerald-800">No schools yet</div>}
			</div>
		</div>
	)
}
