import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { colors, fonts } from "../constants/theme"

type TopBarProps = {
  title?: string
  onPressProfile?: () => void
}

const TopBar: React.FC<TopBarProps> = ({ title = "TaskTrek", onPressProfile }) => {
  const press = useSharedValue(0)

  const iconStyle = useAnimatedStyle(() => {
    const rotate = interpolate(press.value, [0, 1], [0, 18])
    const scale = interpolate(press.value, [0, 1], [1, 0.9])
    return {
      transform: [{ perspective: 600 }, { rotateY: `${-rotate}deg` }, { scale }]
    }
  })

  const handlePress = () => {
    press.value = 1
    onPressProfile && onPressProfile()
    press.value = withTiming(0, { duration: 180 })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.left}>
          <TouchableOpacity accessibilityRole="button" activeOpacity={0.7} style={styles.iconSoftBtn}>
            <MaterialCommunityIcons name="bell-outline" size={20} color={colors.secondary} />
            <View style={styles.badgeDot} />
          </TouchableOpacity>
          <MaterialCommunityIcons name="clipboard-text-outline" size={24} color={colors.primary} />
          <Text style={styles.title}>{title}</Text>
        </View>

        <TouchableOpacity 
          accessibilityRole="button"
          accessibilityLabel="Open profile menu"
          activeOpacity={0.7}
          onPress={handlePress}
          style={styles.profileBtn}
        >
          <Animated.View style={iconStyle}>
            <MaterialCommunityIcons name="account-circle" size={28} color={colors.secondary} />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: colors.bg,
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.medium,
    fontSize: 18,
    color: colors.text,
  },
  profileBtn: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSoftBtn: {
    height: 34,
    width: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    marginRight: 8,
  },
  badgeDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: colors.primary
  }
})

export default TopBar


