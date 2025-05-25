'use client';

import { useState, useEffect } from 'react';
import { usePrivy, useWallets } from '@privy-io/react-auth';
import { Button } from '@/components/ui/Button';
import LoginModal from '@/components/AuthModal';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Link from 'next/link';
import { 
  ChevronDownIcon, 
  UserCircleIcon, 
  WalletIcon, 
  PlusIcon, 
  ArrowDownTrayIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  XMarkIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';
import { ethers } from 'ethers';

export default function NavUser() {
  const { authenticated, user, logout, ready, login, sendTransaction } = usePrivy();
  const { wallets } = useWallets();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isWalletMenuOpen, setIsWalletMenuOpen] = useState(false);
  const [balance, setBalance] = useState("0.00");
  const [isSending, setIsSending] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [embeddedWallet, setEmbeddedWallet] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("0.001");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFundModalOpen, setIsFundModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const setupWallet = async () => {
      if (ready && authenticated && wallets) {
        const embedded = wallets.find(wallet => wallet.walletClientType === 'privy');
        
        if (embedded) {
          setEmbeddedWallet(embedded);
          setWalletAddress(embedded.address);
          
          try {
            const provider = await embedded.getEthereumProvider();
            const ethersProvider = new ethers.providers.Web3Provider(provider);
            const balance = await ethersProvider.getBalance(embedded.address);
            setBalance(ethers.utils.formatEther(balance).substring(0, 6));
          } catch (error) {
            console.error("Error fetching balance:", error);
          }
        }
      }
    };

    setupWallet();
  }, [ready, authenticated, wallets]);

  const handleFund = async () => {
    setIsWalletMenuOpen(false);
    
    if (!embeddedWallet) {
      try {
        await login();
        return;
      } catch (error) {
        console.error("Error during login/wallet creation:", error);
        return;
      }
    }
    
    setIsFundModalOpen(true);
  };

  const copyToClipboard = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
  };

  const openWithdrawModal = () => {
    setIsWithdrawModalOpen(true);
    setIsWalletMenuOpen(false);
    setErrorMessage(null);
    setTxHash(null);
  };

  const handleWithdraw = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!embeddedWallet) return;
    if (!recipientAddress || !withdrawAmount) {
      setErrorMessage("Please enter both recipient address and amount");
      return;
    }
    
    setIsSending(true);
    setErrorMessage(null);
    setTxHash(null);
    
    try {
      if (!ethers.utils.isAddress(recipientAddress)) {
        throw new Error("Invalid Ethereum address");
      }
      
      const amountInEth = parseFloat(withdrawAmount);
      if (isNaN(amountInEth) || amountInEth <= 0) {
        throw new Error("Please enter a valid amount");
      }
      
      const weiValue = ethers.utils.parseEther(withdrawAmount);
      const hexWeiValue = ethers.utils.hexlify(weiValue);
      
      const tx = {
        to: recipientAddress,
        chainId: 0xc488, // Use the Somnia chain ID (same as in chains.ts)
        value: hexWeiValue,
      };
      
      const txConfig = {
        uiOptions: {
          header: "Send Transaction",
          description: `Send ${withdrawAmount} STT to ${recipientAddress.substring(0, 6)}...`,
          buttonText: "Confirm",
        }
      };
      
      const txResponse = await sendTransaction(tx, txConfig);
      console.log("Transaction sent:", txResponse);
      setTxHash(txResponse.hash);
    } catch (error: any) {
      console.error("Error sending transaction:", error);
      setErrorMessage(error.message || "Failed to send transaction");
    } finally {
      setIsSending(false);
    }
  };

  const handleSignMessage = async () => {
    if (!embeddedWallet) return;
    
    setIsSigning(true);
    try {
      const message = "Hello from SuperWager!";
      const signature = await embeddedWallet.signMessage(message);
      console.log("Message signed:", signature);
    } catch (error) {
      console.error("Error signing message:", error);
    } finally {
      setIsSigning(false);
      setIsWalletMenuOpen(false);
    }
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    
    if (user.email?.address) {
      return user.email.address.split('@')[0];
    }
    
    return user.id?.substring(0, 8) || 'User';
  };

  if (!ready) {
    return <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>;
  }

  if (!authenticated) {
    return (
      <>
        <Button 
          onClick={() => setIsLoginModalOpen(true)}
          variant="primary"
        >
          Sign In
        </Button>
        <LoginModal 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <Menu as="div" className="relative">
        <Menu.Button className="flex items-center gap-2 text-sm font-medium">
          <UserCircleIcon className="h-8 w-8" />
          {getDisplayName()}
          <ChevronDownIcon className="h-4 w-4" />
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-gray-100 dark:divide-gray-700">
            <div className="px-4 py-3">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {getDisplayName()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email?.address || ''}
              </p>
            </div>

            <div className="px-4 py-3">
              <div className="mb-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Wallet Address</p>
                  
                  <div className="relative">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsWalletMenuOpen(!isWalletMenuOpen);
                      }}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <WalletIcon className="h-4 w-4" />
                    </button>
                    
                    {isWalletMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                        <button
                          onClick={handleFund}
                          disabled={isSending || isSigning}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <PlusIcon className="mr-2 h-4 w-4" />
                          {embeddedWallet ? 'Get Test STT' : 'Create Wallet'}
                        </button>
                        
                        {embeddedWallet && (
                          <>
                            <button
                              onClick={openWithdrawModal}
                              disabled={isSending || isSigning}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                              {isSending ? 'Sending...' : 'Send STT'}
                            </button>
                            
                            <button
                              onClick={handleSignMessage}
                              disabled={isSending || isSigning}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              <PencilSquareIcon className="mr-2 h-4 w-4" />
                              {isSigning ? 'Signing...' : 'Sign Message'}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
                  {walletAddress ? 
                    `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}` : 
                    'No wallet connected'}
                </p>
              </div>
              
              <div>
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Balance</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {balance} STT
                </p>
              </div>
            </div>

            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/profile"
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } flex items-center px-4 py-2 text-sm`}
                  >
                    <UserCircleIcon className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href="/bet-history"
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } flex items-center px-4 py-2 text-sm`}
                  >
                    <DocumentTextIcon className="mr-2 h-4 w-4" />
                    Bet History
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => logout()}
                    className={`${
                      active ? 'bg-gray-100 dark:bg-gray-700' : ''
                    } flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400`}
                  >
                    <ArrowDownTrayIcon className="mr-2 h-4 w-4" />
                    Sign out
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsWithdrawModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Send STT
                      </h3>
                      <button 
                        onClick={() => setIsWithdrawModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      {txHash ? (
                        <div className="text-center py-4">
                          <div className="text-green-500 mb-2">Transaction sent successfully!</div>
                          <div className="text-sm text-gray-500 break-all">
                            Transaction Hash: <br/>
                            <a 
                              href={`https://explorer.somnia.network/tx/${txHash}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {txHash}
                            </a>
                          </div>
                          <button
                            onClick={() => setIsWithdrawModalOpen(false)}
                            className="mt-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                          >
                            Close
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleWithdraw}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Recipient Address:
                            </label>
                            <input 
                              type="text" 
                              value={recipientAddress}
                              onChange={(e) => setRecipientAddress(e.target.value)}
                              placeholder="0x..."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700"
                              required
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Amount (STT):
                            </label>
                            <input 
                              type="text" 
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              placeholder="0.001"
                              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700"
                              required
                            />
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                              Available: {balance} STT
                            </p>
                          </div>

                          {errorMessage && (
                            <div className="mt-2 text-sm text-red-600 dark:text-red-400 mb-4">
                              {errorMessage}
                            </div>
                          )}
                          
                          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                            <button
                              type="submit"
                              disabled={isSending}
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                            >
                              {isSending ? 'Sending...' : 'Send'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsWithdrawModalOpen(false)}
                              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isFundModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setIsFundModalOpen(false)}
            >
              <div className="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                        Get Test STT
                      </h3>
                      <button 
                        onClick={() => setIsFundModalOpen(false)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Use your wallet address to request test STT from any faucet. Copy the address below:
                      </p>
                      
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-md p-3 mb-4">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-mono break-all">{walletAddress}</p>
                          <button 
                            onClick={copyToClipboard}
                            className="ml-2 text-blue-500 hover:text-blue-600"
                            title="Copy to clipboard"
                          >
                            <ClipboardDocumentIcon className="h-5 w-5" />
                          </button>
                        </div>
                        {isCopied && (
                          <p className="text-green-500 text-xs mt-1">Address copied to clipboard!</p>
                        )}
                      </div>
                      
                      <div className="mt-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <strong>Option:</strong> Visit one of these faucets to get test STT:
                        </p>
                        <div className="flex flex-col space-y-2">
                          <a 
                            href="https://faucet.somnia.network" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline text-sm"
                          >
                            Somnia Faucet
                          </a>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <button
                          onClick={() => setIsFundModalOpen(false)}
                          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}