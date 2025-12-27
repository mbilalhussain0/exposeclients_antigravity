import { createClient } from '@/lib/supabase/server'
import CreateReviewForm from './create-review-form'
import { redirect } from 'next/navigation'

export default async function NewReviewPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: platforms } = await supabase.from('platforms').select('*').order('name')

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Write a Review</h1>
                <p className="text-slate-500">Share your experience with a client to help others.</p>
            </div>
            <CreateReviewForm platforms={platforms || []} />
        </div>
    )
}
