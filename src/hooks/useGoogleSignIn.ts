import { useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useAuthStore } from '../stores/authStore';
import { APP_SCHEME } from '../config/linking';

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || webClientId || undefined;
const androidClientId =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || webClientId || undefined;

export function useGoogleSignIn() {
  const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
  const isLoading = useAuthStore((s) => s.isLoading);

  const redirectUri = useMemo(
    () =>
      makeRedirectUri({
        scheme: APP_SCHEME,
        path: 'oauthredirect',
      }),
    [],
  );

  const googleAuthConfig = useMemo(
    () =>
      webClientId
        ? {
            clientId: webClientId,
            iosClientId: iosClientId ?? webClientId,
            androidClientId: androidClientId ?? webClientId,
            redirectUri,
          }
        : {
            clientId: 'unconfigured.apps.googleusercontent.com',
            iosClientId: 'unconfigured.apps.googleusercontent.com',
            androidClientId: 'unconfigured.apps.googleusercontent.com',
            redirectUri,
          },
    [redirectUri],
  );

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(googleAuthConfig);

  useEffect(() => {
    if (response?.type !== 'success') return;
    const idToken = response.params.id_token;
    if (idToken) {
      loginWithGoogle(idToken).catch(() => undefined);
    }
  }, [response, loginWithGoogle]);

  const signInWithGoogle = () => {
    if (!webClientId) {
      throw new Error('Google sign-in is not configured. Add EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID to .env');
    }
    if (Platform.OS === 'android' && !androidClientId) {
      throw new Error(
        'Add EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID (or EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID) to .env',
      );
    }
    return promptAsync();
  };

  return {
    signInWithGoogle,
    isGoogleConfigured: !!webClientId,
    disabled: !webClientId || !request || isLoading,
    isLoading,
  };
}
