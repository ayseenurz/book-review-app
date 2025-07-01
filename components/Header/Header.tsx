import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

const Header = () => {
  return (
    <View>
      <View style={{flexDirection:'row',justifyContent:"space-between", alignItems: 'flex-end', height: 72, padding:10, marginTop:10 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", color: Colors.light.koyuKahverengi }}>
          Hoşgeldin, ... 
        </Text>
        <View style={{
          borderWidth:2,
          borderRadius:24,
          borderColor: Colors.light.koyuKahverengi
        }}>
        <Image source={require('../../assets/icons/user.png')} style={{
          width: 42,
          height: 42,
          tintColor: Colors.light.koyuKahverengi
        }}/>
        </View>
      </View>
    </View>
  )
}

export default Header

const styles = StyleSheet.create({})