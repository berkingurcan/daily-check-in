import { View, StyleSheet } from 'react-native'
import { AppText } from '@/components/app-text'
import { useCluster } from '../cluster/cluster-provider'
import { ClusterUiVersion } from '@/components/cluster/cluster-ui-version'
import { AppDropdown } from '@/components/app-dropdown'
import { ClusterUiGenesisHash } from '@/components/cluster/cluster-ui-genesis-hash'
import { Colors, Spacing, BorderRadius } from '@/constants/theme'
import { UiIconSymbol } from '@/components/ui/ui-icon-symbol'

export function SettingsUiCluster() {
  const { selectedCluster, clusters, setSelectedCluster } = useCluster()

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <UiIconSymbol name="network" size={20} color={Colors.text.secondary} />
        <AppText variant="h4">Network</AppText>
      </View>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <AppText variant="bodySm" color="secondary">
            Cluster
          </AppText>
          <AppDropdown
            items={clusters.map((c) => c.name)}
            selectedItem={selectedCluster.name}
            selectItem={(name) => setSelectedCluster(clusters.find((c) => c.name === name)!)}
          />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <AppText variant="bodySm" color="secondary">
            Version
          </AppText>
          <ClusterUiVersion selectedCluster={selectedCluster} />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <AppText variant="bodySm" color="secondary">
            Genesis Hash
          </AppText>
          <ClusterUiGenesisHash selectedCluster={selectedCluster} />
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
