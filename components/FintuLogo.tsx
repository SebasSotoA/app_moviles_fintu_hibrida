import { Asset } from "expo-asset";
import React from "react";
import { View } from "react-native";
import { SvgUri } from "react-native-svg";
import { fintuLogoStyles } from "../src/shared/styles/components/fintu-logo";

interface FintuLogoProps {
  size?: number;
  color?: string;
  offsetX?: number; // desplazamiento horizontal opcional
  offsetY?: number; // desplazamiento vertical opcional
}

const FintuLogo: React.FC<FintuLogoProps> = ({
  size = 60,
  offsetX = 0,
  offsetY = 5,
}) => {
  // Resolve the local SVG asset to a URI that SvgUri can load
  const asset = Asset.fromModule(require("../assets/images/fintu-logo.svg"));
  const uri = asset.localUri ?? asset.uri;

  return (
    <View style={fintuLogoStyles.container}>
      {uri ? (
        <SvgUri
          width={size}
          height={size}
          uri={uri}
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: [{ translateX: offsetX }, { translateY: offsetY }],
          }}
        />
      ) : null}
    </View>
  );
};

export default FintuLogo;
