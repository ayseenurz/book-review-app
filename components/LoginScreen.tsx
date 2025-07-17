import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { router, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import useWarmUpBrowser from '../hooks/useWarmUpBrowser'
import { useOAuth } from '@clerk/clerk-expo'
import { fetchAllHomeData } from '@/services/fetchAllHomeData'
import { useHomeData } from '@/app/(tabs)/contexts/HomeDataContext'

WebBrowser.maybeCompleteAuthSession()

const LoginScreen = () => {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { setHomeData } = useHomeData();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onPress = React.useCallback(async () => {
    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();
      if (createdSessionId) {
        setActive?.({ session: createdSessionId });
        const data = await fetchAllHomeData();
        setHomeData(data);
        router.push("/home");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [startOAuthFlow, setHomeData]);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator style={{ marginTop: 10 }} />}
    </View>
  );
};


export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    }
    })