# Book Recommendation Frontend

React + Vite frontend for the Book Recommendation system. The app now supports Supabase authentication (email/password + Google) and uses FastAPI as the recommendation backend.

## Getting started

```bash
cd Book-frontend
npm install
cp env.example .env.local   # then add your Supabase URL + anon key
npm run dev
```

### Environment variables

| Key | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Project URL from the Supabase dashboard |
| `VITE_SUPABASE_ANON_KEY` | Public anon key from Project Settings → API |

> If you deploy the frontend separately (Vercel, Netlify, etc.), be sure to expose both variables in that environment as well.

### Supabase configuration checklist

1. **Disable email confirmation** (required for sign up without verification):
   - Go to Supabase Dashboard → Authentication → Settings
   - Under "Email Auth", toggle OFF "Enable email confirmations"
   - This allows users to sign up and immediately sign in without email verification

2. **Create storage bucket for avatars**:
   - Go to Supabase Dashboard → Storage
   - Create a new bucket named `avatars`
   - Set it to Public (or configure RLS policies if you prefer private)
   - This stores user profile photos uploaded during sign up

3. Enable Email + Google providers in Supabase Auth → Providers (optional, for Google login).
4. For Google, add the site URL(s) as authorized redirect URIs in both Google Cloud Console and Supabase.
5. In Supabase Auth → Settings, add your local dev URL (`http://localhost:5173`) plus any production domains to the `redirect URLs` list.
6. Update your existing `profiles` table to support email/password sign up (see below). The frontend automatically saves user data on sign up and updates it on login.

### Profiles table setup (required)

Your database already has a `profiles` table for Google login. Run the SQL script in `database/update_profiles_table.sql` inside Supabase SQL Editor to add any missing columns needed for email/password sign up. This will:

- Add missing columns if they don't exist: `username`, `full_name`, `avatar_url`, `last_login_at`, `created_at`, `updated_at`
- Set up Row Level Security (RLS) policies so users can only access their own data
- Create indexes for faster queries on `username` and `email`
- Create triggers to automatically:
  - Create/update a user profile when a new auth user signs up (works for both Google and email/password)
  - Update the `updated_at` timestamp when a profile is modified

Alternatively, you can copy and paste the SQL from `database/update_profiles_table.sql` directly into the Supabase SQL Editor and run it.

**Expected columns in your `profiles` table:**
- `id` - UUID (references auth.users, primary key) - *should already exist*
- `email` - User's email address - *should already exist*
- `username` - Unique username chosen during sign up (will be added if missing)
- `full_name` - User's full name (will be added if missing)
- `avatar_url` - URL to the user's profile photo (will be added if missing)
- `last_login_at` - Timestamp of the last login (will be added if missing)
- `created_at` - Timestamp when the account was created (will be added if missing)
- `updated_at` - Timestamp when the profile was last updated (will be added if missing)

The script safely checks if columns exist before adding them, so it won't break your existing table structure.

## Available scripts

- `npm run dev` – start Vite in dev mode with HMR.
- `npm run build` – production build.
- `npm run preview` – locally preview the production build.
- `npm run lint` – run ESLint.

## Project structure

- `src/lib/supabaseClient.js` – Supabase client bootstrap.
- `src/context/AuthContext.jsx` – React context that tracks the Supabase session.
- `src/Components/Auth.jsx` – Custom sign in/sign up form with email, username, password, and profile photo upload.
- `src/Components/Navbar.jsx` – Displays auth state and sign-in/out actions.

With AuthContext in place, any component can call `useAuth()` to read the logged-in user or trigger `signOut()`. Use this hook to protect routes, save user-specific data, or show personalized UI. As you extend the project, ensure any API calls that require auth attach the Supabase session token (via `supabase.auth.getSession()` or Supabase PostgREST helpers).
