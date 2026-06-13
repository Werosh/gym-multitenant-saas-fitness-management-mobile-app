import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuthStore } from '../../stores/authStore';
import { brand, borderRadius, spacing } from '../../config/theme';

const DEMO_ACCOUNTS = [
  { userId: 'user-owner-1', label: 'Owner', role: 'Gym owner' },
  { userId: 'user-trainer-1', label: 'Trainer', role: 'Coach' },
  { userId: 'user-member-1', label: 'Member', role: 'Member app' },
];

export function DemoLoginFab() {
  const insets = useSafeAreaInsets();
  const demoLogin = useAuthStore((s) => s.demoLogin);
  const isLoading = useAuthStore((s) => s.isLoading);
  const [open, setOpen] = useState(false);

  const handleSelect = async (userId: string) => {
    setOpen(false);
    await demoLogin(userId);
  };

  const positionStyle = { top: insets.top + spacing.sm, right: spacing.md };

  return (
    <View style={[styles.container, positionStyle]} pointerEvents="box-none">
      {open && (
        <View style={styles.menu}>
          {DEMO_ACCOUNTS.map((account) => (
            <TouchableOpacity
              key={account.userId}
              style={styles.menuItem}
              onPress={() => handleSelect(account.userId)}
              activeOpacity={0.75}
              disabled={isLoading}
            >
              <Text style={styles.menuLabel}>{account.label}</Text>
              <Text style={styles.menuRole}>{account.role}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.85}
        accessibilityLabel="Demo login"
      >
        {isLoading ? (
          <ActivityIndicator color={brand.black} size="small" />
        ) : (
          <Text style={styles.fabText}>{open ? '×' : 'Demo'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
    alignItems: 'flex-end',
  },
  menu: {
    marginBottom: spacing.sm,
    backgroundColor: 'rgba(10, 10, 10, 0.95)',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(162, 255, 0, 0.35)',
    overflow: 'hidden',
    minWidth: 148,
    ...Platform.select({
      ios: {
        shadowColor: brand.green,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
      android: { elevation: 8 },
    }),
  },
  menuItem: {
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  menuLabel: {
    color: brand.white,
    fontSize: 14,
    fontWeight: '700',
  },
  menuRole: {
    color: brand.gray,
    fontSize: 11,
    marginTop: 2,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: brand.green,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: brand.green,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
      },
      android: { elevation: 8 },
    }),
  },
  fabText: {
    color: brand.black,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
