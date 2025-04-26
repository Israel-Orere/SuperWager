"use client";

import { useAuthModal } from "@/context/AuthModalContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);

  const { setUser } = useAuthModal();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-[#000000a5] flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-lg relative shadow-lg"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <h2 className="text-xl font-semibold my-4 text-center text-[var(--primary)]">
              {isSignUp ? "Sign up" : "Login"}
            </h2>
            {/* Auth form */}
            <form
              className="bg-[var(--primary-light)] p-4"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Form submitted");
                const formData = new FormData(e.currentTarget);
                const data = Object.fromEntries(formData.entries());
                setUser(data as any);
                onClose();
              }}
            >
              {isSignUp && (
                <input
                  type="text"
                  placeholder="Username"
                  name="username"
                  className="border p-2 w-full mb-4 outline-blue-700"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                name="email"
                className="border p-2 w-full mb-4 outline-blue-700"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="border p-2 w-full mb-4 outline-blue-700"
              />
              {isSignUp && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  name="confirm-password"
                  className="border p-2 w-full mb-4 outline-blue-700"
                />
              )}
              <button className="bg-[var(--primary)] text-white w-full py-2 rounded-md">
                {isSignUp ? "Sign Up" : "Login"}
              </button>
            </form>
            <button
              type="submit"
              className="border border-[var(--primary)] p-2 text-[var(--primary)] my-2 mx-auto block"
            >
              {isSignUp ? "Sign Up" : "Login"} via Google
            </button>
            <p className="text-sm mt-4 text-center">
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-[var(--primary)] underline"
              >
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </p>
            <button
              onClick={onClose}
              className="absolute top-2 right-4 text-3xl text-[var(--primary)] hover:text-blue-700"
            >
              &times;
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
