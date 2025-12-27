import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReviewCard } from '@/components/review-card'
import { User } from 'lucide-react'

export default async function UserProfilePage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', params.id)
        .single()

    // If no profile found, maybe user doesn't exist or RLS issues, but profiles are public.
    // Note: users might not have a profile row if not handled on signup trigger.
    // We assume specific trigger creates it or we handle it. 
    // For now, if no profile, we show generic.

    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
      *,
      client:clients(*),
      author:profiles(*),
      platform:platforms(*)
    `)
        .eq('author_id', params.id)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4 border-b pb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Avatar" className="h-full w-full rounded-full object-cover" />
                    ) : (
                        <User className="h-10 w-10 text-slate-500" />
                    )}
                </div>
                <div>
                    <h1 className="text-3xl font-bold">{profile?.display_name || 'User'}</h1>
                    <p className="text-slate-500">Joined {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Reviews ({reviews?.length || 0})</h2>
                <div className="grid gap-6">
                    {reviews?.map(review => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                    {reviews?.length === 0 && (
                        <p className="text-slate-500">This user hasn&apos;t posted any reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
