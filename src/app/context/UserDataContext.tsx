"use client"
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUserData } from "@/services/users/users.client";
import { useAuth } from "@/app/auth/AuthContext";

interface UserDataContextValue {
  userData: any | null;
  loading: boolean;
  error: any;
}

const UserDataContext = createContext<UserDataContextValue>({
  userData: null,
  loading: false,
  error: null,
});

export const UserDataProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (user?.uid) {
      setLoading(true);
      getUserData(user.uid)
        .then((data) => {
          setUserData(data);
          setError(null);
        })
        .catch((err) => {
          setError(err);
          setUserData(null);
        })
        .finally(() => setLoading(false));
    } else {
      setUserData(null);
    }
  }, [user?.uid]);

  return (
    <UserDataContext.Provider value={{ userData, loading, error }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext); 