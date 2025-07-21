// useGoogleAuth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { useEffect } from "react";
// @ts-ignore
import { auth } from "./firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "445816882199-vekiiv0ha2cb0agrp1mcr8rgo95tvkpc.apps.googleusercontent.com",
    iosClientId: "445816882199-dbkmg70amd7clkierqgf28mkcn53rih7.apps.googleusercontent.com",
  });

  useEffect(() => {
    const signIn = async () => {
      if (response?.type === "success") {
        const { idToken } = response.authentication!;
        const credential = GoogleAuthProvider.credential(idToken);
        try {
          // @ts-ignore
          const userCredential = await signInWithCredential(auth, credential);
          // Kullanıcı bilgisini AsyncStorage'a kaydet
          await AsyncStorage.setItem('userToken', userCredential.user.uid);
        } catch (e) {
          // Hata yönetimi
          console.log('Google ile girişte hata:', e);
        }
      }
    };
    signIn();
  }, [response]);

  return { request, promptAsync };
};
