import { redirect } from 'next/navigation';

// Staff now live on the Users page with every other account (filtered to staff here).
export default function StaffPage() {
    redirect('/dashboard/admin/users?role=staff');
}
