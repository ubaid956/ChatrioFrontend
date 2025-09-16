import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Dimensions, PixelRatio, I18nManager } from 'react-native';

const { width, height } = Dimensions.get('window');
const scale = width / 375;

const normalize = size => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const AuthButton = ({
  onPress,
  image,
  text,
  bgColor = '#4285F4',
  textColor = '#fff',
  border = false,
  iconBg = '#fff',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bgColor,
          borderWidth: border ? 1 : 0,
          borderColor: border ? '#000' : 'transparent',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.innerContainer}>
        {image && (
          <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
            <Image source={image} style={styles.icon} resizeMode="contain" />
          </View>
        )}
        <View style={styles.textWrapper}>
          <Text style={[styles.text, { color: textColor }]}>
            {text}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: normalize(10),
    width: width * 0.85,
    height: height * 0.06,
    alignSelf: 'center',
    marginVertical: normalize(10),
    justifyContent: 'center',
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  iconWrapper: {
    borderRadius: normalize(5),
    padding: normalize(4),
    marginRight: normalize(10),
    marginLeft: normalize(10),
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -normalize(18 + 10 + 4), // Negative margin to compensate for icon width + margin + padding
  },
  icon: {
    width: normalize(18),
    height: normalize(20),
  },
  text: {
    fontSize: normalize(16),
    textAlign: 'center',
    width: '100%',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
    textAlignVertical: 'center'

  },
});

export default AuthButton;