import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStyles } from '../../src/shared/hooks';
import { colors, spacing, typography } from '../../src/shared/styles/tokens';

export default function Ajustes() {
  
  const styles = useStyles(() => ({
    container: {
      flex: 1,
      backgroundColor: colors.background.dark,
    },
    content: {
      flex: 1,
      backgroundColor: colors.neutral.white,
      padding: spacing.layout.screenPadding,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: typography.fontSize['2xl'],
      fontWeight: typography.fontWeight.bold,
      color: colors.text.primary,
      marginBottom: spacing[2],
    },
    subtitle: {
      fontSize: typography.fontSize.base,
      color: colors.text.secondary,
    },
  }));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ajustes</Text>
        <Text style={styles.subtitle}>Próximamente...</Text>
      </View>
    </SafeAreaView>
  );
}