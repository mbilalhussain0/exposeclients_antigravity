import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ReviewCard } from '@/components/review-card'
import CommentForm from '@/components/comment-form'
import CommentList from '@/components/comment-list'
import { Separator } from '@/components/ui/separator'

export default async function ReviewPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { data: review } = await supabase
        .from('reviews')
        .select(`
      *,
      client:clients(*),
      author:profiles(*),
      platform:platforms(*)
    `)
        .eq('id', params.id)
        .single()

    if (!review) notFound()

    // Fetch images
    const { data: images } = await supabase
        .from('review_images')
        .select('*')
        .eq('review_id', review.id)

    const { data: comments } = await supabase
        .from('comments')
        .select('*, author:profiles(*)')
        .eq('review_id', review.id)
        .order('created_at', { ascending: true })

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <ReviewCard review={review} />

            {images && images.length > 0 && (
                <div className="space-y-2">
                    <h3 className="font-semibold">Images</h3>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {images.map(img => (
                            <div key={img.id} className="overflow-hidden rounded-md border bg-slate-100">
                                {/* Use public URL if available, or construct it */}
                                <img
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/review-images/${img.storage_path}`}
                                    alt="Review attachment"
                                    className="h-full w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <Separator className="my-8" />
            <div>
                <h3 className="mb-6 text-xl font-semibold">Comments ({comments?.length || 0})</h3>
                <CommentList comments={comments || []} />
                <div className="mt-8">
                    <CommentForm reviewId={review.id} user={user} />
                </div>
            </div>
        </div>
    )
}
