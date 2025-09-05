    import { Asset } from 'expo-asset';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { colors } from '../src/shared/styles/tokens';

    interface HeaderLogoProps {
    size?: number;
    color?: string;
    }

    const HeaderLogo: React.FC<HeaderLogoProps> = ({ 
    size = 150, // Aumentado de 120 a 150
    color = colors.neutral.white 
    }) => {
    // Resolve the local SVG asset to a URI that SvgUri can load
    const asset = Asset.fromModule(require('../assets/icons/fintu-logo.svg'));
    const uri = asset.localUri ?? asset.uri;

    return (
        <View style={styles.logoWrapper}>
        {uri ? (
            <SvgUri
            width={size}
            height={size * 0.4} // Mantener proporción del logo
            uri={uri}
            preserveAspectRatio="xMidYMid meet"
            style={styles.logo}
            />
        ) : null}
        </View>
    );
    };

    const styles = StyleSheet.create({
    logoWrapper: {
        width: 120,   // fixed header space
        height: 48,   // fixed header space
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    logo: {
        pointerEvents: 'none', // El logo no intercepta toques, pero mantiene su tamaño visual
        transform: [{ scale: 5 }], // scale up visually without growing parent height
    },
    });

    export default HeaderLogo;
