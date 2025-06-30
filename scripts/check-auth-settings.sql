-- Check Supabase Auth settings
SELECT 
  setting_name,
  setting_value
FROM auth.config
WHERE setting_name IN (
  'SITE_URL',
  'DISABLE_SIGNUP',
  'EMAIL_CONFIRM_REQUIRED',
  'ENABLE_EMAIL_CONFIRMATIONS'
);

-- Check if there are any email domain restrictions
SELECT * FROM auth.config WHERE setting_name LIKE '%EMAIL%';

-- Check auth users table structure
\d auth.users;

-- Test if we can insert a test profile manually
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users 
LIMIT 5;
