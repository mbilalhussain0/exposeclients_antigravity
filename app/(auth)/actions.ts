'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const authSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validation = authSchema.safeParse({ email, password })
    if (!validation.success) {
        return { error: 'Invalid email or password' }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(prevState: unknown, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const validation = authSchema.safeParse({ email, password })
    if (!validation.success) {
        return { error: 'Invalid email or password' }
    }

    const supabase = await createClient()
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
    })

    if (error) {
        return { error: error.message }
    }

    return { message: 'Check your email to continue sign in process' }
}
