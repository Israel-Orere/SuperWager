"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import AuthModal from "./AuthModal";

const LoginModalWrapper = () => {
  const { isOpen, closeModal } = useAuthModal();

  return <AuthModal isOpen={isOpen} onClose={closeModal} />;
};

export default LoginModalWrapper;
