import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { router, usePathname } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface CustomDrawerContentProps {
  state: any;
  navigation: any;
  descriptors: any;
}

function CustomDrawerContent(props: CustomDrawerContentProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: 'Inicio',
      icon: 'home-outline',
      route: '/(drawer)',
    },
    {
      label: 'Cuentas',
      icon: 'wallet-outline',
      route: '/(drawer)/cuentas',
    },
    {
      label: 'Gráficos',
      icon: 'bar-chart-outline',
      route: '/(drawer)/graficos',
    },
    {
      label: 'Categorías',
      icon: 'list-outline',
      route: '/(drawer)/categorias',
    },
    {
      label: 'Recordatorios',
      icon: 'notifications-outline',
      route: '/(drawer)/recordatorios',
    },
    {
      label: 'Ajustes',
      icon: 'settings-outline',
      route: '/(drawer)/ajustes',
    },
  ];

  return (
    <SafeAreaView style={styles.drawerContainer}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        {/* Encabezado del Drawer */}
                 <View style={styles.drawerHeader}>
           <Ionicons name="person-circle-outline" size={60} color="#FFFFFF" />
           <Text style={styles.userText}>Usuario</Text>
         </View>

        {/* Items del menú */}
        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <DrawerItem
              key={index}
              label={item.label}
              icon={({ size, color }) => (
                                 <Ionicons 
                   name={item.icon as any} 
                   size={size} 
                   color={pathname === item.route ? '#3A7691' : '#FFFFFF'} 
                 />
              )}
              onPress={() => router.push(item.route as any)}
              labelStyle={[
                styles.drawerLabel,
                pathname === item.route && styles.activeDrawerLabel,
              ]}
              style={[
                styles.drawerItem,
                pathname === item.route && styles.activeDrawerItem,
              ]}
            />
          ))}
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Inicio',
        }}
      />
      <Drawer.Screen
        name="cuentas"
        options={{
          drawerLabel: 'Cuentas',
        }}
      />
      <Drawer.Screen
        name="graficos"
        options={{
          drawerLabel: 'Gráficos',
        }}
      />
      <Drawer.Screen
        name="categorias"
        options={{
          drawerLabel: 'Categorías',
        }}
      />
      <Drawer.Screen
        name="recordatorios"
        options={{
          drawerLabel: 'Recordatorios',
        }}
      />
      <Drawer.Screen
        name="ajustes"
        options={{
          drawerLabel: 'Ajustes',
        }}
      />
      <Drawer.Screen
        name="add-transaction"
        options={{
          drawerLabel: 'Añadir Transacción',
          drawerItemStyle: { display: 'none' }, // Ocultar del drawer
        }}
      />
      <Drawer.Screen
        name="choose-category"
        options={{
          drawerLabel: 'Elegir Categoría',
          drawerItemStyle: { display: 'none' }, // Ocultar del drawer
        }}
      />
      <Drawer.Screen
        name="new-account"
        options={{
          drawerLabel: 'Nueva Cuenta',
          drawerItemStyle: { display: 'none' }, // Ocultar del drawer
        }}
      />
      <Drawer.Screen
        name="transfer"
        options={{
          drawerLabel: 'Transferencia',
          drawerItemStyle: { display: 'none' }, // Ocultar del drawer
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#30353D',
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#101215',
    marginBottom: 10,
  },
  userText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 10,
  },
  menuItems: {
    flex: 1,
    paddingTop: 10,
  },
  drawerItem: {
    marginVertical: 2,
    marginHorizontal: 10,
    borderRadius: 8,
  },
  activeDrawerItem: {
    backgroundColor: '#39515C',
  },
  drawerLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 10,
  },
  activeDrawerLabel: {
    color: '#3A7691',
    fontWeight: '600',
  },
});
