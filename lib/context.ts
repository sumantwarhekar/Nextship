"use client";

import { createContext } from 'react';

interface UserContextType {
  user: unknown;
  username: string | null;
  loading?: boolean;
}

export const UserContext = createContext<UserContextType>(
    { user: null, username: null, loading: false }
);