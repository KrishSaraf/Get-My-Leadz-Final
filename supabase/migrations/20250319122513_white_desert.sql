/*
  # Add trigger for auth_users table synchronization
  
  1. Changes
    - Create trigger to automatically add user data to auth_users table on signup
    - Ensure user data consistency between auth and auth_users tables
    
  2. Security
    - Maintain data integrity between auth and custom users table
*/

-- Create a function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO auth_users (id, email, name, password, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.encrypted_password,
    NEW.created_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically add users to auth_users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();