"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/lobby');
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <p>Redirection vers le lobby...</p>
    </div>
  );
}
