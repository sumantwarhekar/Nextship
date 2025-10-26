"use client";

import { UserContext } from './context';

interface UserContextProviderProps {
  children: React.ReactNode;
  value: {
    user: unknown;
    username: string | null;
    loading?: boolean;
  };
}

export default function UserContextProvider({ children, value }: UserContextProviderProps) {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}