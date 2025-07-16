// components/LoadingScreen.tsx
import LottieView from 'lottie-react-native';
import React from 'react';
import { View } from 'react-native';

const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <LottieView
      source={require('../assets/animations/loading-books.json')}
      autoPlay
      loop
      style={{ width: 200, height: 200 }}
    />
  </View>
);

export default LoadingScreen;
