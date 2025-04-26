"use client";

import { createContext, useContext, useEffect, useState } from "react";

type UserType = {
  username: string;
  email: string;
  password: string;
  wallet?: string;
} | null;

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  isSignUp: boolean;
  toggleMode: () => void;
  user: UserType;
  setUser: React.Dispatch<React.SetStateAction<UserType>>;
};

const AuthModalContext = createContext<ModalContextType | undefined>(undefined);

export const AuthModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const toggleMode = () => setIsSignUp((prev) => !prev);

  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        isSignUp,
        openModal,
        closeModal,
        toggleMode,
        user,
        setUser,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used within a AuthModalProvider");
  }
  return context;
};
