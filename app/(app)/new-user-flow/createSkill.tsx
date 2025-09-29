import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { addSkill, markUserSetupComplete } from '../../../Firebase';
import { useAuth } from '../../_layout';
import AddSkillModal from '../../components/AddSkillModal'; // Reusable component for skill details
import { Skill } from '../../components/AppTypes'; // For Skill type definition
import { colors, fonts } from '../../constants/theme';

const CreateSkillScreen = () => {
    const router = useRouter();
    // FIX: Destructure refreshProfile from useAuth
    const { user, refreshProfile } = useAuth(); 
    const [isModalVisible, setIsModalVisible] = useState(true); 
    const [loading, setLoading] = useState(false);

    // --- Core Function: Handles Skill Creation and Redirection ---
    const handleAddFirstSkill = async (newSkillData: Omit<Skill, 'id'>) => {
        if (!user) return; 

        setIsModalVisible(false);
        setLoading(true);
        
        try {
            // 1. Save the new skill to the user's Firestore collection
            await addSkill(user.uid, newSkillData);

            // 2. Mark the user's setup as complete in their profile
            await markUserSetupComplete(user.uid);

            // 3. CRITICAL FIX: Manually tell the AuthProvider to re-fetch the profile state.
            // This immediately updates the global state, allowing the router to proceed.
            await refreshProfile(); 

            // 4. Redirect to the main app dashboard (optional, but clean)
            router.replace('/(tabs)'); 

        } catch (error) {
            console.error("Failed to complete setup and save skill:", error);
            Alert.alert("Error", "Could not save your first skill. Please check your connection and try again.");
            setLoading(false); 
            setIsModalVisible(true); 
        }
    };


    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ title: 'Start Leveling Up', headerShown: true }} />
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingView}>
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text style={styles.loadingText}>Saving your first skill...</Text>
                    </View>
                ) : (
                    <>
                        <Ionicons name="sparkles" size={80} color={colors.primary} style={{ marginBottom: 30 }} />

                        <Text style={styles.header}>👋 Welcome to LevelUp!</Text>
                        <Text style={styles.prompt}>
                            Please define your first skill to begin your journey.
                        </Text>
                        <Text style={styles.instruction}>
                            This is the only way to start gaining XP and seeing progress.
                        </Text>

                        <TouchableOpacity 
                            style={styles.primaryButton}
                            onPress={() => setIsModalVisible(true)}
                        >
                            <Text style={styles.buttonText}>Define First Skill</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {/* The reusable AddSkillModal is integrated here */}
            <AddSkillModal
                isVisible={isModalVisible}
                onClose={() => {
                     // Logic to prevent dismissal is in the modal itself, but we keep this handler
                     if (!loading) {
                        Alert.alert("Required Action", "You must define your first skill to continue your LevelUp journey.");
                        setIsModalVisible(true);
                     }
                }}
                onAddSkill={handleAddFirstSkill} 
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.bg },
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
    loadingView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontFamily: fonts.medium,
        fontSize: 18,
        color: colors.text,
        marginTop: 15,
    },
    header: { fontFamily: fonts.bold, fontSize: 26, color: colors.text, marginBottom: 15 },
    prompt: { fontFamily: fonts.medium, fontSize: 18, color: colors.primary, marginBottom: 5 },
    instruction: { fontFamily: fonts.regular, fontSize: 16, color: colors.light, textAlign: 'center', marginBottom: 40 },
    primaryButton: { 
        backgroundColor: colors.primary, 
        padding: 15, 
        borderRadius: 12, 
        alignItems: 'center', 
        width: '100%',
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: { fontFamily: fonts.bold, fontSize: 18, color: colors.bg },
});

export default CreateSkillScreen;