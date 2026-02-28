# Admin How-To

## Promote a User to Admin

Admin role is stored in Supabase `auth.users.raw_app_meta_data` as `{"role": "admin"}`.

### Setup (one-time)

Run this in **Supabase Dashboard → SQL Editor** to create a helper function:

```sql
CREATE OR REPLACE FUNCTION make_admin(user_email text)
RETURNS void AS $$
  UPDATE auth.users
  SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'::jsonb
  WHERE email = user_email;
$$ LANGUAGE sql SECURITY DEFINER;
```

### Usage

```sql
SELECT make_admin('someone@example.com');
```

### Remove Admin

```sql
UPDATE auth.users
SET raw_app_meta_data = raw_app_meta_data - 'role'
WHERE email = 'someone@example.com';
```

### Verify

```sql
SELECT email, raw_app_meta_data->>'role' AS role
FROM auth.users
WHERE raw_app_meta_data->>'role' = 'admin';
```
