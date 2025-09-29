import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { Quest, Skill, difficultyLevels } from './AppTypes';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SwipeableQuestCardProps {
    item: Quest;
    skill?: Skill;
    onToggleComplete: (id: string) => void;
    onEditQuest: (quest: Quest) => void;
    onDeleteQuest: (id: string) => void;
}

const SwipeableQuestCard = ({ item, skill, onToggleComplete, onEditQuest, onDeleteQuest }: SwipeableQuestCardProps) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const pan = useRef(new Animated.Value(0)).current;
    const isExpanded = item.id === expandedId;
    
    const diff = difficultyLevels.find(d => d.value === item.difficulty);
    const primaryActionColor = item.isComplete ? '#F59E0B' : '#10B981'; // Amber/Green for reactivate/done

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                // Only allow horizontal pan (swipe) and ignore small taps/drags
                return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2 && Math.abs(gestureState.dx) > 10;
            },
            onPanResponderGrant: () => {
                // FIX: Cast pan to 'any' to reliably access the internal __getValue method without TS error
                const currentPanValue = (pan as any).__getValue(); 
                pan.setOffset(currentPanValue); 
                pan.setValue(0);
                setExpandedId(null); // Close actions on start swipe
            },
            onPanResponderMove: Animated.event([null, { dx: pan }], { useNativeDriver: false }),
            onPanResponderRelease: (evt, gestureState) => {
                pan.flattenOffset();
                const swipeThreshold = 100;

                if (gestureState.dx > swipeThreshold) {
                    // Swipe right detected (Mark Done/Reactivate)
                    onToggleComplete(item.id);
                    // Animate card off-screen to the right then reset state
                    Animated.timing(pan, {
                        toValue: SCREEN_WIDTH, // Move off screen
                        duration: 250,
                        useNativeDriver: false,
                    }).start(() => {
                        // Reset pan value after animation finishes
                        pan.setValue(0);
                    });
                } else {
                    // Snap back to original position
                    Animated.spring(pan, {
                        toValue: 0,
                        useNativeDriver: false,
                        bounciness: 0,
                    }).start();
                }
            },
        })
    ).current;

    const handleCardTap = () => {
        setExpandedId(item.id === expandedId ? null : item.id);
        // Snap back if tapping to ensure no residual pan effect
        Animated.spring(pan, { toValue: 0, useNativeDriver: false, bounciness: 0 }).start();
    };

    const actionOpacity = pan.interpolate({
        inputRange: [0, 50],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View style={swipeStyles.cardContainer}>
            {/* Background element for swipe feedback */}
            <Animated.View style={[
                StyleSheet.absoluteFill, 
                swipeStyles.swipeBackground,
                { backgroundColor: primaryActionColor } 
            ]}>
                <Animated.View style={{ opacity: actionOpacity, flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name={item.isComplete ? 'refresh-circle' : 'checkmark-circle'} size={24} color={colors.bg} />
                    <Text style={swipeStyles.swipeText}>
                        {item.isComplete ? 'Reactivate' : 'Mark Done'}
                    </Text>
                </Animated.View>
            </Animated.View>

            <Animated.View 
                style={[
                    swipeStyles.questCard, 
                    isExpanded && swipeStyles.questCardExpanded,
                    { borderLeftColor: skill?.color || colors.light, transform: [{ translateX: pan }] }
                ]}
                {...panResponder.panHandlers}
            >
                <TouchableOpacity onPress={handleCardTap} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[swipeStyles.iconCircle, { backgroundColor: skill?.color + '20' }]}>
                        <Ionicons 
                            name={item.isComplete ? 'checkmark-circle' : (skill?.icon as any || 'help-circle-outline')} 
                            size={24} 
                            color={item.isComplete ? '#10B981' : (skill?.color || colors.light)} 
                        />
                    </View>
                    <View style={swipeStyles.textContainer}>
                        <Text 
                            style={[
                                swipeStyles.questTitle, 
                                item.isComplete && swipeStyles.questTitleComplete
                            ]}
                            numberOfLines={1}
                        >
                            {item.title}
                        </Text>
                        <View style={swipeStyles.detailRow}>
                            <Text style={swipeStyles.questDetail}>{skill?.name}</Text>
                            <View style={[swipeStyles.difficultyTag, { backgroundColor: diff?.color }]}>
                                <Text style={swipeStyles.difficultyText}>{item.difficulty}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
            
            {/* Edit/Delete Actions Panel (Only shows Edit/Delete on tap) */}
            {isExpanded && (
                <View style={swipeStyles.actionsPanel}>
                    <TouchableOpacity 
                        style={[swipeStyles.actionButton, swipeStyles.editButton]}
                        onPress={() => onEditQuest(item)}
                    >
                        <Ionicons name="create-outline" size={24} color={colors.bg} />
                        <Text style={swipeStyles.actionText}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[swipeStyles.actionButton, swipeStyles.deleteButton]}
                        onPress={() => onDeleteQuest(item.id)}
                    >
                        <Ionicons name="trash-outline" size={24} color={colors.bg} />
                        <Text style={swipeStyles.actionText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// --- Stylesheet for SwipeableQuestCard ---
const swipeStyles = StyleSheet.create({
    cardContainer: {
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden', 
    },
    swipeBackground: {
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: 15,
        alignItems: 'flex-start',
    },
    swipeText: {
        fontFamily: fonts.bold,
        fontSize: 16,
        color: colors.bg,
        marginLeft: 10,
    },
    questCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bg,
        padding: 15,
        borderLeftWidth: 5,
        borderColor: colors.primary, 
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderRadius: 12, 
    },
    questCardExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        elevation: 4, 
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    questTitle: {
        fontFamily: fonts.medium,
        fontSize: 16,
        color: colors.text,
    },
    questTitleComplete: {
        textDecorationLine: 'line-through',
        color: colors.light,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    questDetail: {
        fontFamily: fonts.regular,
        fontSize: 12,
        color: colors.light,
        marginRight: 10,
    },
    difficultyTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    difficultyText: {
        fontFamily: fonts.bold,
        fontSize: 10,
        color: colors.bg,
    },
    actionsPanel: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: colors.bg,
        borderTopWidth: 1,
        borderTopColor: colors.light + '20',
        paddingVertical: 10,
        paddingRight: 10,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 10,
    },
    actionText: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: colors.bg,
        marginLeft: 5,
    },
    editButton: {
        backgroundColor: '#F59E0B', 
    },
    deleteButton: {
        backgroundColor: '#EF4444', 
    }
});

export default SwipeableQuestCard;
