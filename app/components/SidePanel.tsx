import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import React, { useEffect } from 'react'
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../_layout'
import { colors, fonts } from "../constants/theme"

type SidePanelProps = {
    visible: boolean
    onClose: () => void
}

const PANEL_WIDTH = Math.min(Dimensions.get('window').width * 0.78, 320)

const MENU_ITEMS = [
    { name: 'Dashboard', icon: 'view-dashboard-outline' as const, target: '/(tabs)/index' },
    { name: 'Quests Manager', icon: 'format-list-checks' as const, target: '/(tabs)/quests-skills' },
    { name: 'Badges & Rewards', icon: 'trophy-outline' as const, target: 'badges' },
    { name: 'Progress Analysis', icon: 'chart-box-outline' as const, target: 'analytics' },
]

const MenuItem = ({ icon, label, onPress, last }: { icon: any, label: string, onPress: () => void, last?: boolean }) => (
    <Pressable 
        style={({ pressed }) => [
            styles.menuItem, 
            last && { borderBottomWidth: 0 },
            { backgroundColor: pressed ? 'rgba(255,255,255,0.2)' : 'transparent' }
        ]} 
        android_ripple={{ color: 'rgba(255,255,255,0.08)' }}
        onPress={onPress}
    >
        <MaterialCommunityIcons name={icon} size={22} color={colors.bg} />
        <Text style={styles.menuText}>{label}</Text>
        <MaterialCommunityIcons name="chevron-right" size={22} color={colors.bg} style={{ marginLeft: 'auto', opacity: 0.7 }} />
    </Pressable>
)

const SidePanel: React.FC<SidePanelProps> = ({ visible, onClose }) => {
    const { user, logout } = useAuth()
    const insets = useSafeAreaInsets()

    const progress = useSharedValue(0)
    const overlayOpacity = useSharedValue(0)

    useEffect(() => {
        if (visible) {
            progress.value = withTiming(1, { duration: 220 })
            overlayOpacity.value = withTiming(1, { duration: 180 })
        } else {
            progress.value = withTiming(0, { duration: 220 }) // smooth slide-out
            overlayOpacity.value = withTiming(0, { duration: 180 })
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
            zIndex: visible ? 100 : -1,
        }
    })

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: overlayOpacity.value,
        zIndex: visible ? 99 : -1,
    }))

    const handleLogout = async () => {
        onClose()
        await logout()
    }

    const handleMenuItemPress = (target: string) => {
        console.log(`Navigating to ${target}`)
        onClose()
    }

    return (
        <>
            {/* Overlay */}
            <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents={visible ? 'auto' : 'none'}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            {/* Sliding Panel */}
            <Animated.View style={[styles.panel, panelStyle]}>
                {/* Header */}
                <View style={[styles.headerCard, { paddingTop: insets.top + 16 }]}>
                    <View style={styles.avatarWrap}>
                        <Image source={require('../../assets/images/react-logo.png')} style={styles.avatar} contentFit="cover" />
                    </View>
                    <View style={{ marginLeft: 14, flexShrink: 1 }}>
                        <Text style={styles.name} numberOfLines={1}>{user?.email || "Guest User"}</Text>
                        <Text style={styles.email} numberOfLines={1}>{user?.uid ? `ID: ${user.uid.substring(0, 8)}...` : 'Not Signed In'}</Text>
                    </View>
                </View>

                {/* Scrollable Menu */}
                <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
                    <View style={styles.menuCard}>
                        <View style={styles.menu}>
                            {MENU_ITEMS.map((item, index) => (
                                <MenuItem 
                                    key={item.name}
                                    icon={item.icon} 
                                    label={item.name}
                                    onPress={() => handleMenuItemPress(item.target)}
                                    last={false}
                                />
                            ))}
                            <MenuItem icon={'cog-outline'} label={'Settings'} onPress={() => handleMenuItemPress('settings')} last={false} />

                            {/* Logout button just below Settings */}
                            <View style={{ marginTop: 16 }}>
                                <Pressable style={styles.logoutButton} android_ripple={{ color: 'rgba(255,255,255,0.2)' }} onPress={handleLogout}>
                                    <Ionicons name="log-out-outline" size={22} color={colors.bg} style={{ marginRight: 8 }} />
                                    <Text style={styles.logoutButtonText}>LOG OUT</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    panel: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        width: PANEL_WIDTH,
        backgroundColor: colors.primary,
        borderTopLeftRadius: 28,
        borderBottomLeftRadius: 28,
        shadowColor: '#000',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 12,
        paddingHorizontal: 16,
    },
    scrollArea: {
        flex: 1,
        marginBottom: 20,
    },
    headerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        marginBottom: 20,
    },
    avatarWrap: {
        height: 56,
        width: 56,
        borderRadius: 28,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    avatar: { height: '100%', width: '100%', borderRadius: 28 },
    name: {
        fontFamily: fonts.bold,
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
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 4,
        marginBottom: 10,
    },
    menu: {},
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'rgba(255,255,255,0.35)',
        gap: 12,
    },
    menuText: {
        fontFamily: fonts.regular,
        fontSize: 15,
        color: '#FFFFFF',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF4444',
        padding: 14,
        borderRadius: 12,
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 5,
    },
    logoutButtonText: {
        fontFamily: fonts.bold,
        fontSize: 16,
        color: colors.bg,
    }
})

export default SidePanel
