'use client';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function FastSignOutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      console.log('User signed out successfully');
      await signOut(); // ends the Clerk session
      router.push('/auth/sign-in');
      console.log('User signed out successfully');
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };

  return (
    <button className='w-full' onClick={handleSignOut}>
      Sign Out
    </button>
  );
}
