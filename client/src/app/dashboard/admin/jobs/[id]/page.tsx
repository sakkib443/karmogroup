import JobForm from "@/components/admin/jobs/JobForm";

/** `/dashboard/admin/jobs/[id]` — edit an existing posting. */
export default async function AdminJobEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <JobForm jobId={id} />;
}
