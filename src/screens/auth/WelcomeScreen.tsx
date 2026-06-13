import React from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Text,
  useWindowDimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useThemeStore } from '../../stores/themeStore';
import { useResponsive } from '../../hooks/useResponsive';
import { AuthStackParamList } from '../../navigation/types';
import { brand, spacing, borderRadius } from '../../config/theme';
import { DemoLoginFab } from '../../components/ui/DemoLoginFab';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

const HERO = require('../../../assets/welcome-hero.png');

export function WelcomeScreen() {
  const navigation = useNavigation<Nav>();
  const colors = useThemeStore((s) => s.colors);
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { horizontalPadding, isSmallPhone } = useResponsive();

  const footerPadBottom = Math.max(insets.bottom, spacing.md);
  const footerPadHorizontal = Math.max(horizontalPadding, spacing.md);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ImageBackground
        source={HERO}
        style={[styles.background, { width, height }]}
        imageStyle={styles.backgroundImage}
        resizeMode="cover"
        accessibilityRole="image"
        accessibilityLabel="MyGymHere welcome"
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.footer,
              {
                paddingBottom: footerPadBottom,
                paddingHorizontal: footerPadHorizontal,
                paddingTop: isSmallPhone ? spacing.lg : spacing.xl,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.cta}
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.85}
            >
              <Text style={styles.ctaText}>Get Started</Text>
            </TouchableOpacity>

            <View style={styles.authRow}>
              <TouchableOpacity
                style={styles.authBtn}
                onPress={() => navigation.navigate('Register')}
                activeOpacity={0.7}
              >
                <Text style={[styles.authBtnText, { color: colors.text }]}>Sign up</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <TouchableOpacity
                style={styles.authBtn}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={[styles.authBtnText, { color: brand.green }]}>Log in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ImageBackground>

      <DemoLoginFab />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: brand.black,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  footer: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(162, 255, 0, 0.2)',
  },
  cta: {
    minHeight: 52,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: brand.green,
    ...Platform.select({
      ios: {
        shadowColor: brand.green,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  ctaText: {
    color: brand.black,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  authRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  authBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    justifyContent: 'center',
  },
  authBtnText: {
    fontSize: 15,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});
