import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import useWarmUpBrowser from '../hooks/useWarmUpBrowser'
import { useOAuth } from '@clerk/clerk-expo'

WebBrowser.maybeCompleteAuthSession()

const LoginScreen = () => {
    useWarmUpBrowser();
    const {startOAuthFlow} = useOAuth({strategy: 'oauth_google',})
   const onPress = React.useCallback(async () => {
    try {
        const {createdSessionId, setActive} = await startOAuthFlow()
        if(createdSessionId) {
            setActive?.({session: createdSessionId})
        }
    } catch (error) {
        console.error(error)
    }
   }, [startOAuthFlow])
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  )
}

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