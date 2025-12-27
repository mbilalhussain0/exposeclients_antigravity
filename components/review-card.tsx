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
        <Card className="overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex flex-col gap-1">
                    <Link href={`/clients/${r.client?.slug}`} className="font-semibold text-lg hover:underline decoration-primary/50 underline-offset-4">
                        {r.client?.name}
                    </Link>
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{r.client?.country}</span>
                </div>
                <div className="flex items-center rounded-full bg-secondary px-2 py-1">
                    {r.rating && (
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={cn(
                                        "h-3.5 w-3.5",
                                        i < r.rating! ? "fill-orange-500 text-orange-500" : "fill-muted text-muted-foreground/30"
                                    )}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm dark:prose-invert text-sm text-foreground/80 line-clamp-4 leading-relaxed mb-4">
                    {r.body}
                </div>
                <div className="flex items-center gap-3 border-t pt-4 mt-auto text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5 font-medium">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="h-3.5 w-3.5" />
                        </div>
                        <span>{r.author?.display_name || 'Anonymous'}</span>
                    </div>
                    <span className="text-muted-foreground/30">•</span>
                    <time dateTime={r.created_at} className="font-mono text-[10px] uppercase">
                        {new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </time>
                    {r.platform && (
                        <>
                            <span className="ml-auto flex items-center gap-1 rounded-sm bg-accent px-1.5 py-0.5">
                                {r.platform?.name}
                            </span>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
