'use client'

import { useRef, useState } from 'react'
import { postComment } from '@/app/reviews/[id]/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function CommentForm({ reviewId, user }: { reviewId: string, user: any }) {
    const ref = useRef<HTMLFormElement>(null)
    const [loading, setLoading] = useState(false)

    async function action(formData: FormData) {
        setLoading(true)
        await postComment(formData)
        setLoading(false)
        ref.current?.reset()
    }

    return (
        <form ref={ref} action={action} className="space-y-4">
            <input type="hidden" name="reviewId" value={reviewId} />

            {!user && (
                <div className="space-y-2">
                    <Label htmlFor="anonymousName">Name (Anonymous)</Label>
                    <Input name="anonymousName" placeholder="Your Name" required />
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="body">Comment</Label>
                <Textarea name="body" placeholder="Write a comment..." required />
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? 'Posting...' : 'Post Comment'}
            </Button>
        </form>
    )
}
