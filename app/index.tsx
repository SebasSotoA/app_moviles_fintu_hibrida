import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {

  useEffect(() => {
    // Siempre ir al Home, el popup de bienvenida se maneja desde allí
    const timer = setTimeout(() => {
      router.replace('/(drawer)/' as any);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Mostrar loading mientras se verifica el estado
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#30353D' 
    }}>
      <ActivityIndicator size="large" color="#3A7691" />
    </View>
  );
}
