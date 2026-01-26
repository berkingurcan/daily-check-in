import { AppPage } from '@/components/app-page'
import { AppText } from '@/components/app-text'
import { SettingsAppConfig } from '@/components/settings/settings-app-config'
import { SettingsResetChallenge } from '@/components/settings/settings-reset-challenge'
import { SettingsUiAccount } from '@/components/settings/settings-ui-account'
import { SettingsUiCluster } from '@/components/settings/settings-ui-cluster'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'
import { BorderRadius, Colors, Spacing } from '@/constants/theme'
import { ScrollView, StyleSheet, View } from 'react-native'

export default function TabSettingsScreen() {
  return (
    <AppPage>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText variant="h2">Settings</AppText>
        </View>

        <SettingsUiAccount />
        <SettingsUiCluster />
        <SettingsResetChallenge />
        <SettingsAppConfig />

        <View style={styles.footer}>
          <UiIconSymbol name="wrench.and.screwdriver" size={14} color={Colors.text.tertiary} />
          <AppText variant="caption" color="tertiary">
            Configure app info and clusters in{' '}
            <AppText variant="caption" style={styles.codeText}>
              constants/app-config.tsx
            </AppText>
          </AppText>
        </View>
      </ScrollView>
    </AppPage>
  )
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: Spacing['2xl'],
    paddingBottom: Spacing['3xl'],
  },
  header: {
    paddingTop: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface.default,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  codeText: {
    fontFamily: 'SpaceMono',
    color: Colors.primary.default,
  },
})
