'use client'

import { useFormState } from 'react-dom'
import { login } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

// Simple wrapper to adapt server action signature if needed
// function loginAction(prevState: any, formData: FormData) {
//   return login(formData)
// }

export default function LoginPage() {
    const [state, formAction] = useFormState(login, null)

    return (
        <div className="mx-auto max-w-sm space-y-6 pt-10">
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-slate-500">Enter your email below to login to your account</p>
            </div>
            <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" placeholder="m@example.com" required type="email" />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                        {/* <Link className="ml-auto inline-block text-sm underline" href="#">
              Forgot your password?
            </Link> */}
                    </div>
                    <Input id="password" name="password" required type="password" />
                </div>
                {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
                <Button className="w-full" type="submit">
                    Login
                </Button>
            </form>
            <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link className="underline" href="/signup">
                    Sign up
                </Link>
            </div>
        </div>
    )
}
