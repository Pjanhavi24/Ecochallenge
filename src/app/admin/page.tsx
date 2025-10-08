import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ManageSchoolsClient } from './ManageSchoolsClient'

export default async function AdminPage() {
	const cookiesStore = await cookies()
	const admin = cookiesStore.get('admin')?.value
	if (admin !== '1') {
		redirect('/admin/login')
	}
	return <ManageSchoolsClient />
}
