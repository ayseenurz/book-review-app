/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    acikKrem: '#f3eee7',
    kahverengi :'#c2b6a3',
    koyuKahverengi: '#6c584c',
    acikKahverengi: '#d4c2b3',
    griKahve:'#a3917b'
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    acikKrem: '#1e1b18', //bg
    kahverengi :'#a89984', //accent,
    koyuKahverengi: '#e6d4c4', //primaryText
    acikKahverengi: '#3d352f', //card bg
    griKahve:'#7a6f63' //secondaryText
  },
};
