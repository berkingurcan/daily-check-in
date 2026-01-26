import { View, StyleSheet } from 'react-native'
import { AppConfig } from '@/constants/app-config'
import { AppText } from '@/components/app-text'
import { AppExternalLink, AppExternalLinkProps } from '@/components/app-external-link'
import { Colors, Spacing, BorderRadius } from '@/constants/theme'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export function SettingsAppConfig() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UiIconSymbol name="info.circle.fill" size={20} color={Colors.text.secondary} />
        <AppText variant="h4">App Info</AppText>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <AppText variant="bodySm" color="secondary">
            Name
          </AppText>
          <AppText variant="label">{AppConfig.name}</AppText>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <AppText variant="bodySm" color="secondary">
            URL
          </AppText>
          <AppExternalLink href={AppConfig.uri as AppExternalLinkProps['href']}>
            <AppText variant="labelSm" color="link">
              {AppConfig.uri}
            </AppText>
          </AppExternalLink>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <AppText variant="bodySm" color="secondary">
            Version
          </AppText>
          <AppText variant="label">1.0.0</AppText>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  content: {
    backgroundColor: Colors.surface.default,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.subtle,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.subtle,
  },
})
