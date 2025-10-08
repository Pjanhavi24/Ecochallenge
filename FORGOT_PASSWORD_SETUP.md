# Password Reset Setup for Supabase

## Database Setup

To enable the forgot password functionality, you need to run the SQL migration in your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase/migrations/create_password_reset_tokens.sql`

This will create:
- `password_reset_tokens` table
- Proper indexes for performance
- Row Level Security (RLS) policies
- Foreign key constraints

## Environment Variables

Make sure you have these environment variables set:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key  # Required for API operations
NEXT_PUBLIC_APP_URL=http://localhost:3000  # or your production URL
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is required for the password reset functionality to work. This key allows the API endpoints to bypass Row Level Security policies when managing password reset tokens.

## Features Implemented

### For Teachers and Students:
- **Forgot Password Page** (`/forgot-password`)
  - Select account type (student/teacher)
  - Enter email address
  - Generates secure reset token
  - Shows success message

- **Reset Password Page** (`/reset-password`)
  - Validates reset token
  - New password form with confirmation
  - Password strength validation
  - Updates password in Supabase Auth

### API Endpoints:
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Security Features:
- Secure token generation (32-byte random hex)
- Token expiration (24 hours)
- One-time use tokens
- Password strength validation
- Rate limiting ready (can be added)
- Row Level Security in Supabase

## Usage Flow:

1. User clicks "Forgot your password?" on login page
2. User selects role and enters email
3. System generates reset token and stores in database
4. User receives reset link (currently logged to console in dev)
5. User clicks link and enters new password
6. Password is updated in Supabase Auth
7. Token is marked as used
8. User can login with new password

## Troubleshooting

### "Failed to reset token" Error

This error typically occurs due to one of these issues:

1. **Missing Service Role Key**: Make sure `SUPABASE_SERVICE_ROLE_KEY` is set in your environment variables
2. **Table doesn't exist**: Run the SQL migration script in your Supabase dashboard
3. **RLS Policy Issues**: The service role policy should allow API operations
4. **Foreign Key Constraint**: Make sure the `users` table has a `user_id` field

### Common Issues:

- **"relation 'password_reset_tokens' does not exist"**: Run the SQL migration
- **"permission denied for table password_reset_tokens"**: Check RLS policies and service role key
- **"foreign key constraint fails"**: Verify the users table structure matches the migration

### Testing the Setup:

1. **Test API connectivity first:**
   - Go to `/api/test-auth` in your browser
   - You should see a JSON response with environment variable status

2. **Test basic forgot password (without database):**
   - Go to `/api/auth/forgot-password-test` 
   - Send a POST request with `{"email": "test@example.com", "role": "student"}`
   - Should return a JSON response with reset URL

3. **Test full forgot password flow:**
   - Go to `/forgot-password`
   - Enter a valid email and select role
   - Check browser console for the reset URL (in development)
   - Click the reset URL to test the password reset flow

### Debugging Steps:

If you get "Unexpected token '<', "<!DOCTYPE "... is not valid JSON":

1. **Check if API route exists:**
   - Visit `/api/test-auth` directly in browser
   - Should show JSON, not HTML

2. **Check environment variables:**
   - Visit `/api/test-auth` to see which env vars are missing
   - Add missing variables to `.env.local`

3. **Check server logs:**
   - Look at your Next.js development server console
   - Look for any error messages during API calls

4. **Test with curl:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/forgot-password-test \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","role":"student"}'
   ```

## Production Notes:

- Replace console.log with actual email sending service
- Remove `resetUrl` from API response in production
- Consider adding rate limiting
- Set up proper email templates
- Configure Supabase email templates if using Supabase Auth email features
