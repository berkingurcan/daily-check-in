import { createContext, type PropsWithChildren, use, useMemo, useState, useEffect, useRef } from 'react'
import { Account, useMobileWallet } from '@wallet-ui/react-native-web3js'
import { AppConfig } from '@/constants/app-config'
import { useMutation } from '@tanstack/react-query'
import { InteractionManager } from 'react-native'

export interface AuthState {
  isAuthenticated: boolean
  signIn: () => Promise<Account>
  signOut: () => Promise<void>
}

const Context = createContext<AuthState>({} as AuthState)

export function useAuth() {
  const value = use(Context)
  if (!value) {
    throw new Error('useAuth must be wrapped in a <AuthProvider />')
  }

  return value
}

function useSignInMutation() {
  const { signIn } = useMobileWallet()

  return useMutation({
    mutationFn: async () =>
      await signIn({
        uri: AppConfig.uri,
      }),
  })
}

/**
 * Debounces authentication state changes to prevent Fabric race conditions.
 * When auth state changes, we wait for animations to complete before
 * updating the navigation state.
 */
function useDebouncedAuth(accounts: readonly Account[] | null | undefined): boolean {
  const hasAccounts = (accounts?.length ?? 0) > 0
  const [debouncedAuth, setDebouncedAuth] = useState(hasAccounts)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interactionRef = useRef<ReturnType<typeof InteractionManager.runAfterInteractions> | null>(null)

  useEffect(() => {
    // Clear any pending updates
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (interactionRef.current) {
      interactionRef.current.cancel()
    }

    if (hasAccounts !== debouncedAuth) {
      // Wait for any running interactions/animations to complete
      interactionRef.current = InteractionManager.runAfterInteractions(() => {
        // Add a small delay to ensure Fabric has finished processing
        timeoutRef.current = setTimeout(() => {
          setDebouncedAuth(hasAccounts)
        }, 100)
      })
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (interactionRef.current) {
        interactionRef.current.cancel()
      }
    }
  }, [hasAccounts, debouncedAuth])

  return debouncedAuth
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { accounts, disconnect } = useMobileWallet()
  const signInMutation = useSignInMutation()

  // Use debounced auth state to prevent Fabric race conditions during navigation
  const isAuthenticated = useDebouncedAuth(accounts)

  const value: AuthState = useMemo(
    () => ({
      signIn: async () => await signInMutation.mutateAsync(),
      signOut: async () => await disconnect(),
      isAuthenticated,
      isLoading: signInMutation.isPending,
    }),
    [isAuthenticated, disconnect, signInMutation],
  )

  return <Context value={value}>{children}</Context>
}
