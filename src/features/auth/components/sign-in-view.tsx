'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SignIn as ClerkSignInForm } from '@clerk/nextjs';
import Link from 'next/link';
import SaveUserToDB from '@/components/save-user-to-db';
import Image from 'next/image';

export default function SignInViewPage() {
  return (
    <div className='relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <Link
        href='/examples/authentication'
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute top-4 right-4 hidden md:top-8 md:right-8'
        )}
      >
        Login
      </Link>
      <div className='relative hidden h-full flex-col bg-zinc-900 p-10 text-white lg:flex dark:border-r'>
        <div className='flex flex-1 items-center justify-center'>
          <Image
            src={'/images/sign-in.png'}
            className=''
            alt='sign in image'
            width={500}
            height={500}
          />
        </div>
        <div className='relative z-20'>
          <blockquote className='space-y-2'>
            <p className='text-lg'>Pls sign in to continue.</p>
          </blockquote>
        </div>
      </div>
      <div className='flex h-full items-center justify-center p-4 lg:p-8'>
        <div className='flex w-full max-w-md flex-col items-center justify-center space-y-6'>
          <ClerkSignInForm
            initialValues={{
              emailAddress: 'test@example.com'
            }}
          />
        </div>
      </div>
      <SaveUserToDB />
    </div>
  );
}
