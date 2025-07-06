import React, { useState } from 'react';
import { Button } from '@/src/components/ui/button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'user@example.com' && password === 'password') {
      setMessage('Login successful!');
    } else {
      setMessage('Invalid credentials.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-2 text-center">Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <Button type="submit" className="w-full">Login</Button>
        {message && <div className="text-center text-sm mt-2 text-gray-600">{message}</div>}
      </form>
    </main>
  );
}