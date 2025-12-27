export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    display_name: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    display_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    display_name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            clients: {
                Row: {
                    id: string
                    name: string
                    country: string
                    slug: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    country: string
                    slug: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    country?: string
                    slug?: string
                    created_at?: string
                }
            }
            platforms: {
                Row: {
                    id: string
                    name: string
                }
                Insert: {
                    id?: string
                    name: string
                }
                Update: {
                    id?: string
                    name?: string
                }
            }
            reviews: {
                Row: {
                    id: string
                    client_id: string
                    author_id: string
                    platform_id: string
                    rating: number | null
                    title: string | null
                    body: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    client_id: string
                    author_id: string
                    platform_id: string
                    rating?: number | null
                    title?: string | null
                    body: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    client_id?: string
                    author_id?: string
                    platform_id?: string
                    rating?: number | null
                    title?: string | null
                    body?: string
                    created_at?: string
                }
            }
            review_images: {
                Row: {
                    id: string
                    review_id: string
                    storage_path: string
                    public_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    review_id: string
                    storage_path: string
                    public_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    review_id?: string
                    storage_path?: string
                    public_url?: string | null
                    created_at?: string
                }
            }
            comments: {
                Row: {
                    id: string
                    client_id: string | null
                    review_id: string | null
                    author_id: string | null
                    anonymous_name: string | null
                    body: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    client_id?: string | null
                    review_id?: string | null
                    author_id?: string | null
                    anonymous_name?: string | null
                    body: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    client_id?: string | null
                    review_id?: string | null
                    author_id?: string | null
                    anonymous_name?: string | null
                    body?: string
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}
