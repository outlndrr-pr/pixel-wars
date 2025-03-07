'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import RetroWindow from '@/components/RetroWindow';
import RetroButton from '@/components/RetroButton';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    await signIn('anonymous', { callbackUrl: '/' });
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };
  
  const handleCancel = () => {
    router.push('/');
  };
  
  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <RetroWindow title="Join Pixel Wars" className="max-w-md w-full">
        <div className="p-4 flex flex-col gap-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-2">Choose how to join</h2>
            <p className="text-sm">
              Playing anonymously lets you place pixels right away with basic features.
              Creating an account gives you more pixels to place and special features!
            </p>
          </div>
          
          <div className="flex flex-col gap-4">
            <RetroButton
              onClick={handleAnonymousSignIn}
              disabled={isLoading}
              className="w-full py-3"
            >
              {isLoading ? 'Loading...' : 'Play Anonymously'} 
              <span className="text-xs ml-2">(5 pixels per minute)</span>
            </RetroButton>
            
            <div className="relative flex items-center justify-center my-2">
              <div className="border-t border-gray-300 flex-grow"></div>
              <span className="px-3 bg-[#F8D848] text-sm">OR</span>
              <div className="border-t border-gray-300 flex-grow"></div>
            </div>
            
            <RetroButton
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-3"
            >
              {isLoading ? 'Loading...' : 'Sign in with Google'} 
              <span className="text-xs ml-2">(10 pixels per minute)</span>
            </RetroButton>
            
            <button 
              onClick={handleCancel}
              className="mt-4 text-sm underline"
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      </RetroWindow>
    </div>
  );
} 