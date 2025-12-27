import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from './ui/button'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2 transition-opacity hover:opacity-85">
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        ExposeClients
                    </span>
                </Link>
                <div className="flex-1" />
                <div className="flex items-center space-x-2">
                    {user ? (
                        <>
                            <Link href="/reviews/new">
                                <Button variant="default" size="sm" className="hidden sm:inline-flex">Write a Review</Button>
                                <Button variant="default" size="sm" className="sm:hidden">Write</Button>
                            </Link>
                            <Link href={`/u/${user.id}`}>
                                <Button variant="ghost" size="sm">Profile</Button>
                            </Link>
                            <form action="/auth/signout" method="post">
                                <Button variant="ghost" size="sm" type="submit">
                                    Sign out
                                </Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">Log in</Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">Sign up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
