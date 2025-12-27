import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ReviewCard } from '@/components/review-card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function ClientPage({ params }: { params: { slug: string } }) {
    const supabase = createClient()

    const { data: client } = await supabase
        .from('clients')
        .select('*')
        .eq('slug', params.slug)
        .single()

    if (!client) {
        notFound()
    }

    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
      *,
      client:clients(*),
      author:profiles(*),
      platform:platforms(*)
    `)
        .eq('client_id', client.id)
        .order('created_at', { ascending: false })

    // Calculate average rating
    const avgRating = reviews && reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.filter(r => r.rating).length).toFixed(1)
        : 'N/A'

    return (
        <div className="space-y-8">
            <div>
                <Link href="/" className="mb-4 inline-flex items-center text-sm text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Search
                </Link>
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-4xl font-bold">{client.name}</h1>
                        <p className="text-lg text-slate-500">{client.country}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold text-slate-900">{avgRating}</div>
                        <div className="text-sm text-slate-500">{reviews?.length} Reviews</div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {reviews?.map(review => (
                    // Wrap card in link to detail view
                    <Link key={review.id} href={`/reviews/${review.id}`} className="block transition-transform hover:scale-[1.01]">
                        <ReviewCard review={review} />
                    </Link>
                ))}
                {reviews?.length === 0 && (
                    <p className="text-slate-500">No reviews yet.</p>
                )}
            </div>
        </div>
    )
}
