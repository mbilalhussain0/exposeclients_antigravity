'use client'

import { useFormState } from 'react-dom'
import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

export default function SignupPage() {
    const [state, formAction] = useFormState(signup, null)

    return (
        <div className="mx-auto max-w-sm space-y-6 pt-10">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-slate-500">Enter your information to create an account</p>
            </div>
            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder="m@example.com" required type="email" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" name="password" required type="password" />
                </div>
                {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
                {state?.message && <p className="text-sm text-green-500">{state.message}</p>}
                <Button className="w-full" type="submit">
                    Sign Up
                </Button>
            </form>
            <div className="text-center text-sm">
                Already have an account?{' '}
                <Link className="underline" href="/login">
                    Login
                </Link>
            </div>
        </div>
    )
}
