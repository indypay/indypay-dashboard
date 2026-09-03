'use client';

import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { LockIcon } from 'lucide-react';

export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="mb-8 flex justify-center">
          <LockIcon className="h-24 w-24 text-purple-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          {`Sorry, you don't have permission to access this page. Please contact
          your administrator if you think this is a mistake.`}
        </p>
        <Button
          className="bg-purple-600 text-white font-semibold hover:bg-purple-700"
          size="lg"
          onPress={() => router.push('/summary/overview')}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
