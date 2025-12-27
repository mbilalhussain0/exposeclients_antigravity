import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from './ui/button'

export default async function Navbar() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="border-b bg-white">
            <div className="container flex h-16 items-center px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="text-lg font-bold">ExposeClients</span>
                </Link>
                <div className="flex-1" />
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link href="/reviews/new">
                                <Button variant="default">Write a Review</Button>
                            </Link>
                            <Link href={`/u/${user.id}`}>
                                <Button variant="ghost">Profile</Button>
                            </Link>
                            <form action="/auth/signout" method="post">
                                <Button variant="ghost" type="submit">
                                    Sign out
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost">Log in</Button>
                            </Link>
                            <Link href="/signup">
                                <Button>Sign up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
