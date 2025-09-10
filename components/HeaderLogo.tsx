import { Asset } from "expo-asset";
import React from "react";
import { View } from "react-native";
import { SvgUri } from "react-native-svg";
import { headerLogoStyles } from "../src/shared/styles/components/header-logo";
import { colors } from "../src/shared/styles/tokens";

interface HeaderLogoProps {
  size?: number;
  color?: string;
}

const HeaderLogo: React.FC<HeaderLogoProps> = ({
  size = 150, // Aumentado de 120 a 150
  color = colors.neutral.white,
}) => {
  // Resolve the local SVG asset to a URI that SvgUri can load
  const asset = Asset.fromModule(require("../assets/icons/fintu-logo.svg"));
  const uri = asset.localUri ?? asset.uri;

  return (
    <View style={headerLogoStyles.logoWrapper}>
      {uri ? (
        <SvgUri
          width={size}
          height={size * 0.4} // Mantener proporción del logo
          uri={uri}
          preserveAspectRatio="xMidYMid meet"
          style={headerLogoStyles.logo}
        />
      ) : null}
    </View>
  );
};

export default HeaderLogo;
