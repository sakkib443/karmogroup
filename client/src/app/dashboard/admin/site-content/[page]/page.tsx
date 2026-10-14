"use client";

import { useParams } from 'next/navigation';
import PageEditor from '@/components/admin/cms/PageEditor';

/** Admin → Site content → one page's editor (with live preview). */
export default function SiteContentPageEditor() {
    const params = useParams();
    const page = String(params?.page || '');
    return <PageEditor key={page} pageId={page} />;
}
