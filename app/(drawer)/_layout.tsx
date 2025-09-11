import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Text, View } from "react-native";
import React from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import {
  drawerStyles,
  drawerTextStyles,
} from "../../src/shared/styles/components";
import { colors } from "../../src/shared/styles/tokens";

// Importar SVGs
import PersonCircleOutline from "../../assets/icons/person-circle-outline.svg";
import HomeOutline from "../../assets/icons/home-outline.svg";
import WalletOutline from "../../assets/icons/wallet-outline.svg";
import BarChartOutline from "../../assets/icons/bar-chart-outline.svg";
import ListOutline from "../../assets/icons/list-outline.svg";
import NotificationsOutline from "../../assets/icons/notifications-outline.svg";
import SettingsOutline from "../../assets/icons/settings-outline.svg";

interface CustomDrawerContentProps {
  state: any;
  navigation: any;
  descriptors: any;
}

function CustomDrawerContent(props: CustomDrawerContentProps) {
  const pathname = usePathname();

  // Mapa de íconos locales
  const ICONS: Record<string, any> = {
    "person-circle-outline": PersonCircleOutline,
    "home-outline": HomeOutline,
    "wallet-outline": WalletOutline,
    "bar-chart-outline": BarChartOutline,
    "list-outline": ListOutline,
    "notifications-outline": NotificationsOutline,
    "settings-outline": SettingsOutline,
  };

  const menuItems = [
    {
      label: "Inicio",
      icon: "home-outline",
      route: "/(drawer)",
    },
    {
      label: "Cuentas",
      icon: "wallet-outline",
      route: "/(drawer)/accounts",
    },
    {
      label: "Gráficos",
      icon: "bar-chart-outline",
      route: "/(drawer)/charts",
    },
    {
      label: "Categorías",
      icon: "list-outline",
      route: "/(drawer)/categories",
    },
    {
      label: "Recordatorios",
      icon: "notifications-outline",
      route: "/(drawer)/reminders",
    },
    {
      label: "Ajustes",
      icon: "settings-outline",
      route: "/(drawer)/settings",
    },
  ];

  return (
    <SafeAreaView style={drawerStyles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={drawerStyles.content}
      >
        {/* Encabezado del Drawer */}
        <View style={drawerStyles.header}>
          <View style={drawerStyles.logoContainer}>
            {React.createElement(ICONS["person-circle-outline"], {
              style: drawerStyles.logo,
              fill: colors.neutral.white
            })}
            <Text style={drawerTextStyles.userText}>Usuario</Text>
          </View>
        </View>

        {/* Items del menú */}
        <View style={drawerStyles.menuItems}>
          {menuItems.map((item, index) => (
            <DrawerItem
              key={index}
              label={item.label}
              icon={({ size }) => {
                const IconComponent = ICONS[item.icon];
                return (
                  <IconComponent
                    width={size}
                    height={size}
                    fill={pathname === item.route ? colors.primary[500] : colors.neutral.white}
                  />
                );
              }}
              onPress={() => router.push(item.route as any)}
              labelStyle={[
                drawerTextStyles.label,
                pathname === item.route && drawerTextStyles.activeLabel,
              ]}
              style={[
                drawerStyles.item,
                pathname === item.route && drawerStyles.activeItem,
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
        drawerType: "front",
        drawerStyle: {
          width: 280,
        },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Inicio",
        }}
      />
      <Drawer.Screen
        name="accounts"
        options={{
          drawerLabel: "Cuentas",
        }}
      />
      <Drawer.Screen
        name="charts"
        options={{
          drawerLabel: "Gráficos",
        }}
      />
      <Drawer.Screen
        name="categories"
        options={{
          drawerLabel: "Categorías",
        }}
      />
      <Drawer.Screen
        name="reminders"
        options={{
          drawerLabel: "Recordatorios",
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Ajustes",
        }}
      />
      <Drawer.Screen
        name="add-transaction"
        options={{
          drawerLabel: "Añadir Transacción",
          drawerItemStyle: { display: "none" }, // Ocultar del drawer
        }}
      />
      <Drawer.Screen
        name="choose-category"
        options={{
          drawerLabel: "Elegir Categoría",
          drawerItemStyle: { display: "none" }, // Ocultar del drawer
        }}
      />
      <Drawer.Screen
        name="new-account"
        options={{
          drawerLabel: "Nueva Cuenta",
          drawerItemStyle: { display: "none" }, // Ocultar del drawer
        }}
      />
      <Drawer.Screen
        name="transfer"
        options={{
          drawerLabel: "Transferencia",
          drawerItemStyle: { display: "none" }, // Ocultar del drawer
        }}
      />
    </Drawer>
  );
}
