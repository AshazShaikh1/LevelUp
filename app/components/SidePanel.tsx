import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useEffect } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { colors, fonts } from "../constants/theme"

type SidePanelProps = {
  visible: boolean
  onClose: () => void
}

const PANEL_WIDTH = Math.min(Dimensions.get('window').width * 0.78, 320)

const SidePanel: React.FC<SidePanelProps> = ({ visible, onClose }) => {
  const progress = useSharedValue(0)
  const overlayOpacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      progress.value = withTiming(1, { duration: 220 })
      overlayOpacity.value = withTiming(1, { duration: 180 })
    } else {
      progress.value = withTiming(0, { duration: 200 })
      overlayOpacity.value = withTiming(0, { duration: 150 })
    }
  }, [visible])

  const panelStyle = useAnimatedStyle(() => {
    const translateX = interpolate(progress.value, [0, 1], [PANEL_WIDTH, 0])
    const rotateY = interpolate(progress.value, [0, 1], [12, 0])
    return {
      transform: [
        { perspective: 800 },
        { translateX },
        { rotateY: `${-rotateY}deg` },
      ],
    }
  })

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }))

  return (
    <>
      <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View style={[styles.panel, panelStyle]}>
        <View style={styles.header}>
          <View style={styles.avatarWrap}>
            <Image
              source={require('../../assets/images/react-logo.png')}
              style={styles.avatar}
              contentFit="cover"
            />
          </View>
          <View style={{ marginLeft: 14 }}>
            <Text style={styles.name}>Joy Mitchell</Text>
            <Text style={styles.email}>UI/UX Designer</Text>
          </View>
        </View>

        <View style={styles.menuCard}>
          <View style={styles.menu}>
            <MenuItem icon="view-list-outline" label="To-do's" />
            <MenuItem icon="shape-outline" label="Categories" />
            <MenuItem icon="chart-areaspline" label="Analytics" />
            <MenuItem icon="cog-outline" label="Settings" />
          </View>
        </View>

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Consistency</Text>
          <View style={styles.sparkline}>
            <View style={styles.sparkDot} />
            <View style={[styles.sparkDot, { left: 40, top: 10 }]} />
            <View style={[styles.sparkDot, { left: 80, top: 3 }]} />
            <View style={[styles.sparkDot, { left: 120, top: 16 }]} />
            <View style={[styles.sparkDot, { left: 160, top: 8 }]} />
          </View>
        </View>
      </Animated.View>
    </>
  )
}

  const MenuItem = ({ icon, label, last }: { icon: any, label: string, last?: boolean }) => (
  <Pressable style={[styles.menuItem, last && { borderBottomWidth: 0 }]} android_ripple={{ color: 'rgba(255,255,255,0.08)' }}>
    <MaterialCommunityIcons name={icon} size={22} color={colors.secondary} />
    <Text style={styles.menuText}>{label}</Text>
    <MaterialCommunityIcons name="chevron-right" size={22} color={colors.light} style={{ marginLeft: 'auto' }} />
  </Pressable>
)

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: PANEL_WIDTH,
    backgroundColor: colors.primary,
    paddingTop: 48,
    paddingHorizontal: 16,
    borderTopLeftRadius: 28,
    borderBottomLeftRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarWrap: {
    height: 56,
    width: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)'
  },
  avatar: { height: '100%', width: '100%', borderRadius: 28 },
  name: {
    fontFamily: fonts.medium,
    fontSize: 16,
    color: '#FFFFFF',
  },
  email: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#E6E8EC',
    marginTop: 2,
  },
  menuCard: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  menu: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(230,232,236,0.35)',
    gap: 12,
  },
  menuText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#FFFFFF',
  },
  footerCard: {
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  footerTitle: {
    color: '#FFFFFF',
    fontFamily: fonts.medium,
    marginBottom: 10
  },
  sparkline: {
    height: 36,
    position: 'relative',
    justifyContent: 'flex-end'
  },
  sparkDot: {
    position: 'absolute',
    left: 0,
    bottom: 8,
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF'
  }
})

export default SidePanel


