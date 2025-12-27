import { formatDistanceToNow } from 'date-fns' // wait I don't have date-fns, use simple logic or install
// I'll use simple Date logic to avoid install

export default function CommentList({ comments }: { comments: any[] }) {
    return (
        <div className="space-y-6">
            {comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm">
                                {comment.author?.display_name || comment.anonymous_name || 'Anonymous'}
                            </span>
                            <span className="text-xs text-slate-500">
                                {new Date(comment.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        <p className="text-sm text-slate-700">{comment.body}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}
