import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  drawerStyles,
  drawerTextStyles,
} from "../../src/shared/styles/components";
import { colors } from "../../src/shared/styles/tokens";

interface CustomDrawerContentProps {
  state: any;
  navigation: any;
  descriptors: any;
}

function CustomDrawerContent(props: CustomDrawerContentProps) {
  const pathname = usePathname();

  // Mapa de íconos locales
  const ICONS: Record<string, any> = {
    "person-circle-outline": require("../../assets/icons/person-circle-outline.svg"),
    "home-outline": require("../../assets/icons/home-outline.svg"),
    "wallet-outline": require("../../assets/icons/wallet-outline.svg"),
    "bar-chart-outline": require("../../assets/icons/bar-chart-outline.svg"),
    "list-outline": require("../../assets/icons/list-outline.svg"),
    "notifications-outline": require("../../assets/icons/notifications-outline.svg"),
    "settings-outline": require("../../assets/icons/settings-outline.svg"),
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
            <Image
              source={ICONS["person-circle-outline"]}
              style={drawerStyles.logo}
              tintColor={colors.neutral.white}
              resizeMode="contain"
            />
            <Text style={drawerTextStyles.userText}>Usuario</Text>
          </View>
        </View>

        {/* Items del menú */}
        <View style={drawerStyles.menuItems}>
          {menuItems.map((item, index) => (
            <DrawerItem
              key={index}
              label={item.label}
              icon={({ size }) => (
                <Image
                  source={ICONS[item.icon]}
                  style={{
                    width: size,
                    height: size,
                    tintColor:
                      pathname === item.route
                        ? colors.primary[500]
                        : colors.neutral.white,
                  }}
                  resizeMode="contain"
                />
              )}
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
