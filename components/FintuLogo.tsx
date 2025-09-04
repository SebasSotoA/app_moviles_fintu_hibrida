import { Asset } from 'expo-asset';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import colors from '../src/shared/styles/themes';

interface FintuLogoProps {
  size?: number;
  color?: string;
  offsetX?: number; // desplazamiento horizontal opcional
  offsetY?: number; // desplazamiento vertical opcional
}

const FintuLogo: React.FC<FintuLogoProps> = ({ size = 60, color = colors.primary, offsetX = 0, offsetY = 5 }) => {
  // Resolve the local SVG asset to a URI that SvgUri can load
  const asset = Asset.fromModule(require('../assets/images/fintu-logo.svg'));
  const uri = asset.localUri ?? asset.uri;

  return (
    <View style={styles.container}>
      {uri ? (
        <SvgUri
          width={size}
          height={size}
          uri={uri}
          preserveAspectRatio="xMidYMid meet"
          style={{ transform: [{ translateX: offsetX }, { translateY: offsetY }] }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FintuLogo;
