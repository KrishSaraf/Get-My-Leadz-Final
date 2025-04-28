import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('auth_users')
          .select('email')
          .eq('email', email)
          .single();

        if (existingUser) {
          throw new Error('User already exists with this email');
        }

        // Create new user in auth_users table
        const { error: signUpError } = await supabase
          .from('auth_users')
          .insert([
            {
              email,
              password,
              name
              // 'wow' will be set automatically by trigger
            }
          ]);

        if (signUpError) throw signUpError;

        setSignupSuccess(true);
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        // Simple sign in - just check email and password match
        await login(email, password);
        navigate('/customers');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">
          Welcome to Get my Leadz
        </h1>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <div className="p-6 space-y-6">
            <div className="flex justify-center space-x-4">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  !isSignUp
                    ? 'bg-[#5B3CC4] text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setIsSignUp(false)}
              >
                Sign In
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isSignUp
                    ? 'bg-[#5B3CC4] text-white'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setIsSignUp(true)}
              >
                Sign Up
              </button>
            </div>

            {/* Disclaimer outside the form, but only visible on Sign Up */}
            {isSignUp && (
              <div className="mt-2 p-3 bg-[#f7f0ff] border border-[#e2d6fa] text-[#5B3CC4] text-xs rounded-md">
                Please clear your cache or use incognito mode if you are creating an account for the second time.
              </div>
            )}

            {signupSuccess && !isSignUp && (
              <div className="bg-green-50 text-green-800 p-4 rounded-md mb-4">
                Sign up successful! Please proceed to sign in.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  placeholder="Enter your full name"
                />
              )}

              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />

              {isSignUp && (
                <Input
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={isSignUp}
                  placeholder="Confirm your password"
                />
              )}

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button
                type="submit"
                className="w-full"
                loading={loading}
              >
                {isSignUp ? 'Sign Up' : 'Sign In'} with Email
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
