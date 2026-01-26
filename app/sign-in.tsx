import { router } from 'expo-router'
import { useAuth } from '@/components/auth/auth-provider'
import { AppText } from '@/components/app-text'
import { AppConfig } from '@/constants/app-config'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export default function SignIn() {
  const { signIn } = useAuth()

  const handleConnect = async () => {
    await signIn()
    router.replace('/')
  }

  return (
    <View style={styles.container}>
      {/* Aurora gradient overlay */}
      <LinearGradient
        colors={['rgba(0, 217, 181, 0.08)', 'rgba(167, 139, 250, 0.05)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientOverlay}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Top spacer */}
        <View style={styles.topSpacer} />

        {/* Main content */}
        <View style={styles.content}>
          {/* Logo with glow effect */}
          <View style={styles.logoContainer}>
            <View style={styles.logoGlow} />
            <Image source={require('../assets/images/icon.png')} style={styles.logo} contentFit="contain" />
          </View>

          {/* App name */}
          <AppText variant="h1" style={styles.title}>
            {AppConfig.name}
          </AppText>

          {/* Tagline */}
          <AppText variant="body" color="secondary" style={styles.tagline}>
            Build habits on-chain.{'\n'}12 days to transform your life.
          </AppText>

          {/* Features list */}
          <View style={styles.features}>
            <FeatureItem icon="checkmark.seal.fill" text="Blockchain-verified check-ins" />
            <FeatureItem icon="chart.line.uptrend.xyaxis" text="Progressive commitment" />
            <FeatureItem icon="trophy.fill" text="Complete your 12-day journey" />
          </View>
        </View>

        {/* Connect button */}
        <View style={styles.bottomSection}>
          <TouchableOpacity onPress={handleConnect} activeOpacity={0.85}>
            <LinearGradient
              colors={Colors.gradient.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.connectButton}
            >
              <UiIconSymbol name="wallet.pass.fill" size={22} color={Colors.text.inverse} />
              <AppText variant="buttonLg" style={styles.connectButtonText}>
                Connect Wallet
              </AppText>
            </LinearGradient>
          </TouchableOpacity>

          <AppText variant="caption" color="tertiary" style={styles.disclaimer}>
            Powered by Solana Mobile
          </AppText>
        </View>
      </SafeAreaView>
    </View>
  )
}

function FeatureItem({ icon, text }: { icon: string; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <UiIconSymbol name={icon as any} size={16} color={Colors.primary.default} />
      </View>
      <AppText variant="bodySm" color="secondary">
        {text}
      </AppText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topSpacer: {
    flex: 0.1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.xl,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  logoGlow: {
    position: 'absolute',
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    backgroundColor: Colors.primary.glow,
    borderRadius: 100,
    opacity: 0.5,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.xl,
  },
  title: {
    textAlign: 'center',
    color: Colors.text.primary,
  },
  tagline: {
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.lg,
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    ...Shadows.glowPrimary,
  },
  connectButtonText: {
    color: Colors.text.inverse,
  },
  disclaimer: {
    textAlign: 'center',
  },
})
