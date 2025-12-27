import { createClient } from '@/lib/supabase/server'
import { ReviewCard } from '@/components/review-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function Home({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const supabase = createClient()
  const query = searchParams.q

  let reviewsQuery = supabase
    .from('reviews')
    .select(`
      *,
      client:clients!inner(*),
      author:profiles(*),
      platform:platforms(*)
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  if (query) {
    // Search clients by name
    reviewsQuery = reviewsQuery.ilike('client.name', `%${query}%`)
  }

  const { data: reviews, error } = await reviewsQuery

  return (
    <div className="space-y-8">
      <section className="mx-auto max-w-2xl space-y-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Freelancer Reviews
        </h1>
        <p className="text-muted-foreground">
          Check your client's history before you start working.
        </p>
        <form action="/" method="get" className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              name="q"
              placeholder="Search clients..."
              className="pl-9"
              defaultValue={query}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Latest Reviews</h2>
        {error ? (
          <p className="text-red-500">Error loading reviews.</p>
        ) : reviews?.length === 0 ? (
          <p className="text-slate-500">No reviews found.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reviews?.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
