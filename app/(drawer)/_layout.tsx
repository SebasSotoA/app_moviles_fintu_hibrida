import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  drawerStyles,
  drawerTextStyles,
} from "../../src/shared/styles/components";
import { colors } from "../../src/shared/styles/tokens";

// Importar SVGs
import BarChartOutline from "../../assets/icons/bar-chart-outline.svg";
import HomeOutline from "../../assets/icons/home-outline.svg";
import ListOutline from "../../assets/icons/list-outline.svg";
import NotificationsOutline from "../../assets/icons/notifications-outline.svg";
import PersonCircleOutline from "../../assets/icons/person-circle-outline.svg";
import SettingsOutline from "../../assets/icons/settings-outline.svg";
import WalletOutline from "../../assets/icons/wallet-outline.svg";

interface CustomDrawerContentProps {
  state: any;
  navigation: any;
  descriptors: any;
}

function CustomDrawerContent(props: CustomDrawerContentProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "Inicio",
      icon: HomeOutline,
      route: "/(drawer)",
    },
    {
      label: "Cuentas",
      icon: WalletOutline,
      route: "/(drawer)/accounts",
    },
    {
      label: "Gráficos",
      icon: BarChartOutline,
      route: "/(drawer)/charts",
    },
    {
      label: "Categorías",
      icon: ListOutline,
      route: "/(drawer)/categories",
    },
    {
      label: "Recordatorios",
      icon: NotificationsOutline,
      route: "/(drawer)/reminders",
    },
    {
      label: "Ajustes",
      icon: SettingsOutline,
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
            <PersonCircleOutline
              style={drawerStyles.logo}
              fill={colors.neutral.white}
            />
            <Text style={drawerTextStyles.userText}>Usuario</Text>
          </View>
        </View>

         {/* Items del menú */}
         <View style={drawerStyles.menuItems}>
           {menuItems.map((item, index) => {
             const IconComponent = item.icon;
             const isActive = pathname === item.route;
             return (
               <TouchableOpacity
                 key={index}
                 style={[
                   drawerStyles.item,
                   isActive && drawerStyles.activeItem,
                 ]}
                 onPress={() => router.push(item.route as any)}
                 activeOpacity={0.7}
               >
                 <IconComponent
                   width={24}
                   height={24}
                   color={isActive ? colors.primary[500] : colors.neutral.white}
                   style={drawerStyles.itemIcon}
                 />
                 <Text
                   style={[
                     drawerTextStyles.label,
                     isActive && drawerTextStyles.activeLabel,
                   ]}
                 >
                   {item.label}
                 </Text>
               </TouchableOpacity>
             );
           })}
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
