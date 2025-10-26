"use client";

import { useUserData } from '../../lib/hooks';
import UserContextProvider from '../../lib/UserContextProvider';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  const userData = useUserData();

  return (
    <UserContextProvider value={userData}>
      {children}
      <Toaster />
    </UserContextProvider>
  );
}