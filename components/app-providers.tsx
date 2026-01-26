import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MobileWalletProvider } from '@wallet-ui/react-native-web3js'
import { PropsWithChildren } from 'react'
import { AuthProvider } from '@/components/auth/auth-provider'
import { ClusterProvider, useCluster } from '@/components/cluster/cluster-provider'
import { AppTheme } from '@/components/app-theme'
import { LogBox } from 'react-native'

// Suppress known Fabric architecture warnings that don't affect functionality
LogBox.ignoreLogs([
  'RetryableMountingLayerException',
  'Unable to find viewState',
  'Surface stopped',
])

// Global error handler to filter out Fabric exceptions
const setupGlobalErrorHandler = () => {
  // ErrorUtils is a React Native global - check if available
  if (typeof ErrorUtils === 'undefined') {
    return
  }

  const originalHandler = ErrorUtils.getGlobalHandler()

  ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
    const errorMessage = error?.message || error?.toString() || ''

    // Check if this is a known Fabric exception that can be safely ignored
    const isFabricError =
      errorMessage.includes('RetryableMountingLayerException') ||
      errorMessage.includes('Unable to find viewState') ||
      errorMessage.includes('Surface stopped')

    if (isFabricError) {
      // Log but don't crash for Fabric errors
      console.warn('[GlobalErrorHandler] Suppressed Fabric error:', errorMessage)
      return
    }

    // Pass through to original handler for other errors
    if (originalHandler) {
      originalHandler(error, isFatal)
    }
  })
}

// Initialize global error handler
setupGlobalErrorHandler()

const queryClient = new QueryClient()
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AppTheme>
      <QueryClientProvider client={queryClient}>
        <ClusterProvider>
          <SolanaProvider>
            <AuthProvider>{children}</AuthProvider>
          </SolanaProvider>
        </ClusterProvider>
      </QueryClientProvider>
    </AppTheme>
  )
}

// We have this SolanaProvider because of the network switching logic.
// If you only connect to a single network, use MobileWalletProvider directly.
function SolanaProvider({ children }: PropsWithChildren) {
  const { selectedCluster } = useCluster()
  return (
    <MobileWalletProvider
      chain={selectedCluster.id}
      endpoint={selectedCluster.endpoint}
      identity={{ name: 'Wallet UI Example Web3js Expo' }}
    >
      {children}
    </MobileWalletProvider>
  )
}
