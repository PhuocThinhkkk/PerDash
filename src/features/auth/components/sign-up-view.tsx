import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignUp as ClerkSignUpForm } from '@clerk/nextjs';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms'
};

export default function SignUpViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Sign Up
      </Link>
      <div className='relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex dark:border-r'>
        <div className='flex flex-1 items-center justify-center'>
          <Image
            src={'/images/sign-up.png'}
            className=''
            alt='sign in image'
            width={500}
            height={500}
          />
        </div>
        <div className='relative z-20'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>
              Create your account with email or using Google.
            </p>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <ClerkSignUpForm
            initialValues={{
              emailAddress: 'test@example.com'
            }}
          />
        </div>
      </div>
    </div>
  );
}
