// // "use client";

// // import { useAuthModal } from "@/context/AuthModalContext";
// // import { motion, AnimatePresence } from "framer-motion";
// // import { useState } from "react";

// // interface Props {
// //   isOpen: boolean;
// //   onClose: () => void;
// // }

// // const AuthModal: React.FC<Props> = ({ isOpen, onClose }) => {
// //   const [isSignUp, setIsSignUp] = useState(false);

// //   const { setUser } = useAuthModal();

// //   return (
// //     <AnimatePresence>
// //       {isOpen && (
// //         <motion.div
// //           className="fixed inset-0 bg-[#000000a5] flex items-center justify-center z-50"
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           exit={{ opacity: 0 }}
// //         >
// //           <motion.div
// //             className="bg-white rounded-xl p-6 w-full max-w-lg relative shadow-lg"
// //             initial={{ opacity: 0, scale: 0.95, y: -20 }}
// //             animate={{ opacity: 1, scale: 1, y: 0 }}
// //             exit={{ opacity: 0, scale: 0.95, y: -20 }}
// //             transition={{ duration: 0.3, ease: "easeInOut" }}
// //           >
// //             <h2 className="text-xl font-semibold my-4 text-center text-[var(--primary)]">
// //               {isSignUp ? "Sign up" : "Login"}
// //             </h2>
// //             {/* Auth form */}
// //             <form
// //               className="bg-[var(--primary-light)] p-4"
// //               onSubmit={(e) => {
// //                 e.preventDefault();
// //                 console.log("Form submitted");
// //                 const formData = new FormData(e.currentTarget);
// //                 const data = Object.fromEntries(formData.entries());
// //                 setUser(data as any);
// //                 localStorage.setItem("user", JSON.stringify(data));
// //                 onClose();
// //               }}
// //             >
// //               {isSignUp && (
// //                 <input
// //                   type="text"
// //                   placeholder="Username"
// //                   name="username"
// //                   className="border p-2 w-full mb-4 outline-blue-700"
// //                 />
// //               )}
// //               <input
// //                 type="email"
// //                 placeholder="Email"
// //                 name="email"
// //                 className="border p-2 w-full mb-4 outline-blue-700"
// //               />
// //               <input
// //                 type="password"
// //                 placeholder="Password"
// //                 name="password"
// //                 className="border p-2 w-full mb-4 outline-blue-700"
// //               />
// //               {isSignUp && (
// //                 <input
// //                   type="password"
// //                   placeholder="Confirm Password"
// //                   name="confirm-password"
// //                   className="border p-2 w-full mb-4 outline-blue-700"
// //                 />
// //               )}
// //               <button className="bg-[var(--primary)] text-white w-full py-2 rounded-md">
// //                 {isSignUp ? "Sign Up" : "Login"}
// //               </button>
// //             </form>
// //             <button
// //               type="submit"
// //               className="border border-[var(--primary)] p-2 text-[var(--primary)] my-2 mx-auto block"
// //             >
// //               {isSignUp ? "Sign Up" : "Login"} via Google
// //             </button>
// //             <p className="text-sm mt-4 text-center">
// //               {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
// //               <button
// //                 onClick={() => setIsSignUp(!isSignUp)}
// //                 className="text-[var(--primary)] underline"
// //               >
// //                 {isSignUp ? "Login" : "Sign Up"}
// //               </button>
// //             </p>
// //             <button
// //               onClick={onClose}
// //               className="absolute top-2 right-4 text-3xl text-[var(--primary)] hover:text-blue-700"
// //             >
// //               &times;
// //             </button>
// //           </motion.div>
// //         </motion.div>
// //       )}
// //     </AnimatePresence>
// //   );
// // };

// // export default AuthModal;


// 'use client';

// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { useAuth } from '@/hooks/useAuth';
// import { Button } from '@/components/ui/Button';

// type LoginModalProps = {
//   isOpen: boolean;
//   onClose: () => void;
// };

// export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
//   const { login, isAuthenticated } = useAuth();

//   const handleLogin = async () => {
//     await login();
//     onClose();
//   };

//   // If user is already authenticated, close the modal
//   if (isAuthenticated) {
//     onClose();
//     return null;
//   }

//   return (
//     <Transition appear show={isOpen} as={Fragment}>
//       <Dialog as="div" className="relative z-50" onClose={onClose}>
//         <Transition.Child
//           as={Fragment}
//           enter="ease-out duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="ease-in duration-200"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-black/25" />
//         </Transition.Child>

//         <div className="fixed inset-0 overflow-y-auto">
//           <div className="flex min-h-full items-center justify-center p-4 text-center">
//             <Transition.Child
//               as={Fragment}
//               enter="ease-out duration-300"
//               enterFrom="opacity-0 scale-95"
//               enterTo="opacity-100 scale-100"
//               leave="ease-in duration-200"
//               leaveFrom="opacity-100 scale-100"
//               leaveTo="opacity-0 scale-95"
//             >
//               <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
//                 <Dialog.Title
//                   as="h3"
//                   className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
//                 >
//                   Sign In to SuperWager
//                 </Dialog.Title>
//                 <div className="mt-4">
//                   <p className="text-sm text-gray-500 dark:text-gray-300">
//                     Connect to place bets, track your performance, and compete on the leaderboard.
//                   </p>
//                 </div>

//                 <div className="mt-6">
//                   <Button
//                     onClick={handleLogin}
//                     className="w-full justify-center"
//                     variant="primary"
//                     size="lg"
//                   >
//                     Connect with Privy
//                   </Button>
//                 </div>
//               </Dialog.Panel>
//             </Transition.Child>
//           </div>
//         </div>
//       </Dialog>
//     </Transition>
//   );
// }

// 

'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { usePrivy } from '@privy-io/react-auth'; // Direct import

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  // Use Privy hook directly for more reliable operation
  const { login } = usePrivy();

  const handleLogin = async () => {
    try {
      await login();
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  Sign In to SuperWager
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    Connect to place bets, track your performance, and compete on the leaderboard.
                  </p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleLogin}
                    className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-red-600 text-white hover:bg-red-700 transition-all text-sm"
                  >
                    Connect with Privy
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}