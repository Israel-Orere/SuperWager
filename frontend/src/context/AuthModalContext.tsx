"use client";

import { createContext, useContext, useState } from "react";

type ModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  isSignUp: boolean;
  toggleMode: () => void;
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

  return (
    <AuthModalContext.Provider
      value={{ isOpen, isSignUp, openModal, closeModal, toggleMode }}
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
