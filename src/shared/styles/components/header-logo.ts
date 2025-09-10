import { StyleSheet } from "react-native";

export const headerLogoStyles = StyleSheet.create({
  logoWrapper: {
    width: 120, // fixed header space
    height: 50, // fixed header space
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  logo: {
    pointerEvents: "none", // El logo no intercepta toques, pero mantiene su tamaño visual
    transform: [{ scale: 6 }], // scale up visually without growing parent height
  },
});
