-- Check if there are any email domain restrictions in Supabase
SELECT 
  setting_name,
  setting_value
FROM auth.config
WHERE setting_name LIKE '%EMAIL%' OR setting_name LIKE '%DOMAIN%';

-- Check current auth configuration
SELECT 
  setting_name,
  setting_value
FROM auth.config
WHERE setting_name IN (
  'DISABLE_SIGNUP',
  'EMAIL_CONFIRM_REQUIRED',
  'ENABLE_EMAIL_CONFIRMATIONS',
  'SITE_URL'
);

-- If you want to temporarily disable email confirmation for testing:
-- UPDATE auth.config SET setting_value = 'false' WHERE setting_name = 'EMAIL_CONFIRM_REQUIRED';
