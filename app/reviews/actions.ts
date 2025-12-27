'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
// import { slugify } from '@/lib/utils' // Need a slugify function

const reviewSchema = z.object({
    clientName: z.string().min(1),
    clientCountry: z.string().min(1),
    platformId: z.string().uuid(),
    rating: z.coerce.number().min(1).max(5).nullable(),
    title: z.string().optional(),
    body: z.string().min(10),
    imagePaths: z.array(z.string()).optional(), // Paths uploaded to storage
    reviewId: z.string().uuid(), // Pre-generated ID
})

function generateSlug(name: string, country: string) {
    const base = `${name}-${country}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    // In a real app we might append a hash if collision, but here we assume uniqueness or handle DB error
    return base
}

export async function createReview(formData: FormData) {
    const supabase = await createClient()

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to post a review.' }
    }

    // Ensure profile exists
    let { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single()
    if (!profile) {
        // Create profile if missing
        const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            display_name: user.email?.split('@')[0] || 'Anonymous',
        })
        if (profileError) {
            // Ignore duplicate key error in case of race condition
            if (profileError.code !== '23505') {
                return { error: 'Failed to create user profile: ' + profileError.message }
            }
        }
    }

    // Parse data
    const rawData = {
        clientName: formData.get('clientName'),
        clientCountry: formData.get('clientCountry'),
        platformId: formData.get('platformId'),
        rating: formData.get('rating'),
        title: formData.get('title'),
        body: formData.get('body'),
        reviewId: formData.get('reviewId'),
        imagePaths: formData.get('imagePaths') ? JSON.parse(formData.get('imagePaths') as string) : [],
    }

    const validation = reviewSchema.safeParse(rawData)
    if (!validation.success) {
        return { error: 'Invalid data', details: validation.error.flatten() }
    }

    const { clientName, clientCountry, platformId, rating, title, body, reviewId, imagePaths } = validation.data

    // 1. Find or Create Client
    const slug = generateSlug(clientName, clientCountry)

    // Try to find client
    let { data: client } = await supabase.from('clients').select('id, slug').eq('slug', slug).single()

    if (!client) {
        // Create new client
        const { data: newClient, error: clientError } = await supabase.from('clients').insert({
            name: clientName,
            country: clientCountry,
            slug: slug
        }).select().single()

        if (clientError) {
            if (clientError.code === '23505') { // Unique violation
                // Fetch again, race condition
                const { data: existing } = await supabase.from('clients').select('id, slug').eq('slug', slug).single()
                client = existing
            } else {
                return { error: 'Failed to create client: ' + clientError.message }
            }
        } else {
            client = newClient
        }
    }

    if (!client) return { error: 'Could not resolve client.' }

    // 2. Create Review
    const { error: reviewError } = await supabase.from('reviews').insert({
        id: reviewId,
        client_id: client.id,
        author_id: user.id,
        platform_id: platformId,
        rating,
        title,
        body
    })

    if (reviewError) {
        return { error: 'Failed to create review: ' + reviewError.message }
    }

    // 3. Insert Image Records
    if (imagePaths && imagePaths.length > 0) {
        const imageRecords = imagePaths.map((path) => ({
            review_id: reviewId,
            storage_path: path
        }))

        // We don't necessarily know the public_url yet or we construct it.
        // Schema has public_url nullable. We can derive it on read or update it.
        // For now, just insert path.
        const { error: imagesError } = await supabase.from('review_images').insert(imageRecords)

        if (imagesError) {
            console.error('Failed to save image metadata', imagesError)
            // Initial review created, so maybe not fail entirely, but warn.
        }
    }

    redirect(`/clients/${client.slug}`)
}
