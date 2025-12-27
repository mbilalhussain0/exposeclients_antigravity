# ExposeClients

A platform for freelancers to review clients. Built with Next.js 14+, Supabase, and TailwindCSS.

## Features

- **Authentication**: Sign up and login with email/password (Supabase Auth).
- **Reviews**: detailed reviews with ratings, text, and images.
- **Client Profiles**: Aggregated reviews and average ratings per client.
- **Search**: Find clients by name.
- **Comments**: Discuss reviews (Auth & Anonymous supported).
- **User Profiles**: View reviews by specific users.

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Supabase Setup

1. Create a new Supabase project.
2. Go to the SQL Editor and run the migration found in `supabase/migrations/20240501000000_init.sql`.
   - This creates all tables, indexes, and RLS policies.
   - It also buckets `review-images`.
3. Ensure Email Auth is enabled in Authentication -> Providers.
4. (Optional) Disable "Confirm email" in Auth settings for easier local testing.

### 3. Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000).

## Tech Stack

- **Frontend**: Next.js App Router, TypeScript, TailwindCSS
- **Backend**: Supabase (Postgres, Auth, Storage)
- **Validation**: Zod + React Hook Form (or server actions with Zod)
- **Icons**: Lucide React

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components.
- `lib/supabase/`: Supabase client/server utilities.
- `types/`: TypeScript definitions.
- `supabase/migrations/`: SQL migration files.

## Future Improvements

- **Moderation**: Add a `reports` table and admin dashboard to hide content.
- **Captcha**: Integrate Turnstile or reCAPTCHA for anonymous comments.
- **Reputation**: Add "Helpful" votes on reviews.
- **Notifications**: Email users when they get a comment.
