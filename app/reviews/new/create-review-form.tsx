'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createReview } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
// import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'

export default function CreateReviewForm({ platforms }: { platforms: { id: string; name: string }[] }) {
    const [loading, setLoading] = useState(false)
    const [files, setFiles] = useState<File[]>([])
    const [error, setError] = useState<string | null>(null)

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        const reviewId = crypto.randomUUID()

        // Upload images first
        const uploadedPaths: string[] = []
        if (files.length > 0) {
            const supabase = createClient()
            for (const file of files) {
                const path = `reviews/${reviewId}/${file.name}`
                const { error: uploadError } = await supabase.storage
                    .from('review-images')
                    .upload(path, file)

                if (uploadError) {
                    setError(`Image upload failed: ${uploadError.message}`)
                    setLoading(false)
                    return
                }
                uploadedPaths.push(path)
            }
        }

        formData.append('reviewId', reviewId)
        formData.append('imagePaths', JSON.stringify(uploadedPaths))

        // Call server action
        const result = await createReview(formData)
        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
        // Redirect handles success
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prev => [...prev, ...Array.from(e.target.files!)])
        }
    }

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    return (
        <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" name="clientName" required placeholder="e.g. John Doe" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="clientCountry">Country</Label>
                    <Input id="clientCountry" name="clientCountry" required placeholder="e.g. USA" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="platformId">Platform</Label>
                <select
                    id="platformId"
                    name="platformId"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
                    required
                >
                    <option value="">Select a platform</option>
                    {platforms.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    required
                    placeholder="5"
                    className="w-24"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="title">Review Title (Optional)</Label>
                <Input id="title" name="title" placeholder="Great experience..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="body">Review</Label>
                <Textarea id="body" name="body" required placeholder="Describe your experience..." className="min-h-[150px]" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="images">Images</Label>
                <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                    {files.map((f, i) => (
                        <div key={i} className="relative rounded border bg-slate-50 px-2 py-1 text-xs flex items-center gap-2">
                            <span className="max-w-[150px] truncate">{f.name}</span>
                            <button type="button" onClick={() => removeFile(i)} className="text-red-500 hover:text-red-700">
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <Button type="submit" disabled={loading}>
                {loading ? 'Submitting...' : 'Post Review'}
            </Button>
        </form>
    )
}
