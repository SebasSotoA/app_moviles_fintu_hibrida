import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import globalStyles from '../../src/shared/styles/globalStyles';

export default function Ajustes() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Ajustes</Text>
        <Text style={styles.subtitle}>Próximamente...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = { ...globalStyles};