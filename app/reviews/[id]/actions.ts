'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const commentSchema = z.object({
    reviewId: z.string().uuid(),
    body: z.string().min(1),
    anonymousName: z.string().optional(),
})

export async function postComment(formData: FormData) {
    const supabase = createClient()
    const reviewId = formData.get('reviewId') as string
    const body = formData.get('body') as string
    const anonymousName = formData.get('anonymousName') as string

    const validation = commentSchema.safeParse({ reviewId, body, anonymousName })
    if (!validation.success) {
        return { error: 'Invalid input' }
    }

    const { data: { user } } = await supabase.auth.getUser()

    const insertData: any = {
        review_id: reviewId,
        body: body,
    }

    if (user) {
        insertData.author_id = user.id
    } else {
        if (!anonymousName) {
            return { error: 'Name is required for anonymous comments.' }
        }
        insertData.anonymous_name = anonymousName
    }

    const { error } = await supabase.from('comments').insert(insertData)

    if (error) {
        return { error: 'Failed to post comment: ' + error.message }
    }

    revalidatePath(`/reviews/${reviewId}`)
    return { success: true }
}
