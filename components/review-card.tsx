import Link from 'next/link'
import { Star, User } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Define a type that matches the join query result
type ReviewWithDetails = {
    id: string
    body: string
    rating: number | null
    created_at: string
    client: {
        name: string
        country: string
        slug: string
    } | null
    author: {
        display_name: string | null
        avatar_url: string | null
    } | null
    platform?: {
        name: string
    } | null
}

export function ReviewCard({ review }: { review: ReviewWithDetails }) {
    const r = review

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                    <Link href={`/clients/${r.client?.slug}`} className="font-semibold hover:underline">
                        {r.client?.name}
                    </Link>
                    <span className="text-xs text-slate-500">{r.client?.country}</span>
                </div>
                <div className="flex items-center">
                    {r.rating && (
                        <div className="flex">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-4 w-4",
                                        i < r.rating! ? "fill-orange-400 text-orange-400" : "fill-slate-100 text-slate-200"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{r.body}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{r.author?.display_name || 'Anonymous'}</span>
                    </div>
                    <span>•</span>
                    <time>{new Date(r.created_at).toLocaleDateString()}</time>
                    {r.platform && (
                        <>
                            <span>•</span>
                            <span>{r.platform?.name}</span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
