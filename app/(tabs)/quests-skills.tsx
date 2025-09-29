import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, fonts } from '../constants/theme';

// --- Component Imports ---
// We assume these files are correctly created in the '../components' directory.
import AddEditQuestModal from '../components/AddEditQuestModal';
import AddSkillModal from '../components/AddSkillModal';
import { Quest, Skill } from '../components/AppTypes'; // Import necessary Types
import SwipeableQuestCard from '../components/SwipeableQuestCard';


// --- Component: Quests List Renderer (Using imported Swipeable Card) ---
interface QuestsListProps {
    quests: Quest[];
    skills: Skill[];
    onEditQuest: (quest: Quest) => void;
    onDeleteQuest: (id: string) => void;
    onToggleComplete: (id: string) => void;
}

const QuestsList = ({ quests, skills, onEditQuest, onDeleteQuest, onToggleComplete }: QuestsListProps) => {
    if (quests.length === 0) {
        return (
            <View style={managerStyles.emptyStateContainer}>
                <Ionicons name="sparkles-outline" size={80} color={colors.light} />
                <Text style={managerStyles.emptyStateTitle}>No Quests Yet!</Text>
                <Text style={managerStyles.emptyStateSubtitle}>
                    Tap the '+' button below to create your first quest and start leveling up.
                </Text>
            </View>
        );
    }

    return (
        <View style={managerStyles.tabContent}>
            <Text style={managerStyles.tabTitle}>Active Quests</Text>
            <Text style={managerStyles.tabSubtitle}>Swipe right to mark done. Tap to edit/delete.</Text>

            <FlatList
                data={quests}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    // Find the linked skill to pass its color/icon to the card
                    const skill = skills.find(s => s.id === item.skillId);
                    return (
                        <SwipeableQuestCard
                            item={item}
                            skill={skill}
                            onToggleComplete={onToggleComplete}
                            onEditQuest={onEditQuest}
                            onDeleteQuest={onDeleteQuest}
                        />
                    );
                }}
                ListFooterComponent={<View style={{ height: 120 }} />}
            />
        </View>
    );
};


// --- Component: Skills List Renderer ---
interface SkillsListProps {
    skills: Skill[];
    onAddSkill: () => void;
    onEditSkill: (skill: Skill) => void;
    onDeleteSkill: (id: string) => void;
}

const SkillsList = ({ skills, onAddSkill, onEditSkill, onDeleteSkill }: SkillsListProps) => {
    if (skills.length === 0) {
        return (
            <View style={managerStyles.emptyStateContainer}>
                <Ionicons name="trophy-outline" size={80} color={colors.light} />
                <Text style={managerStyles.emptyStateTitle}>Time to Learn!</Text>
                <Text style={managerStyles.emptyStateSubtitle}>
                    Start by defining a new skill you want to master.
                </Text>
                <TouchableOpacity style={skillStyles.addSkillButtonLarge} onPress={onAddSkill}>
                    <Ionicons name="add" size={24} color={colors.bg} />
                    <Text style={skillStyles.addSkillTextLarge}>Add New Skill</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={managerStyles.tabContent}>
            <Text style={managerStyles.tabTitle}>My Skills</Text>
            <Text style={managerStyles.tabSubtitle}>Manage your skills, levels are shown on the Dashboard.</Text>

            <FlatList
                data={skills}
                numColumns={2}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={skillStyles.skillCard}>
                        {/* Edit/Delete Overlay */}
                        <View style={skillStyles.skillCardOverlay}>
                            <TouchableOpacity onPress={() => onEditSkill(item)} style={skillStyles.overlayButton}>
                                <Ionicons name="create-outline" size={20} color={colors.bg} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onDeleteSkill(item.id)} style={skillStyles.overlayButton}>
                                <Ionicons name="trash-outline" size={20} color={colors.bg} />
                            </TouchableOpacity>
                        </View>

                        <View style={[skillStyles.iconWrapper, { backgroundColor: item.color + '20' }]}>
                            <Ionicons name={item.icon as any} size={36} color={item.color} />
                        </View>
                        <Text style={skillStyles.skillTitle}>{item.name}</Text>
                        <Text style={skillStyles.skillDetail}>Tap to Edit</Text>
                    </TouchableOpacity>
                )}
                ListHeaderComponent={() => (
                    <TouchableOpacity style={skillStyles.addSkillCard} onPress={onAddSkill}>
                        <Ionicons name="add-circle-outline" size={40} color={colors.light} />
                        <Text style={skillStyles.addSkillText}>Add New Skill</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={<View style={{ height: 120 }} />}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
            />
        </View>
    );
};


// --- Main Component: Quests / Skills Manager ---
const QuestsSkillsManager = () => {
    // --- LOCAL STATE (TO BE REPLACED BY FIREBASE) ---
    const [skills, setSkills] = useState<Skill[]>([]);
    const [quests, setQuests] = useState<Quest[]>([]);
    // --------------------------------------------------

    const [activeTab, setActiveTab] = useState('Quests');
    const [isQuestModalVisible, setIsQuestModalVisible] = useState(false);
    const [isSkillModalVisible, setIsSkillModalVisible] = useState(false);
    const [questToEdit, setQuestToEdit] = useState<Quest | null>(null);

    // --- CRUD Logic for Local State (Will soon become Firestore calls) ---
    const handleSaveQuest = (newQuest: Quest) => {
        if (questToEdit) {
            setQuests(quests.map(q => q.id === newQuest.id ? newQuest : q));
            setQuestToEdit(null);
        } else {
            setQuests([...quests, { ...newQuest, isComplete: false }]);
        }
    };

    const handleEditQuest = (quest: Quest) => {
        setQuestToEdit(quest);
        setIsQuestModalVisible(true);
    };

    const handleDeleteQuest = (id: string) => {
        setQuests(quests.filter(q => q.id !== id));
    };

    const handleToggleComplete = (id: string) => {
        setQuests(quests.map(q => q.id === id ? { ...q, isComplete: !q.isComplete } : q));
    };

    const handleAddSkill = (newSkill: Skill) => {
        setSkills([...skills, newSkill]);
    };

    const handleEditSkill = (skill: Skill) => {
        console.log(`Editing skill: ${skill.name}. Launching modal...`);
    };

    const handleDeleteSkill = (id: string) => {
        setSkills(skills.filter(s => s.id !== id));
        setQuests(quests.filter(q => q.skillId !== id));
    };

    return (
        <SafeAreaView style={managerStyles.safeArea}>
            <View style={managerStyles.header}>
                <Text style={managerStyles.headerTitle}>Quest & Skill Manager</Text>
            </View>

            {/* Tab Selection (Segmented Control) */}
            <View style={managerStyles.tabSelector}>
                <TouchableOpacity
                    style={[managerStyles.tabButton, activeTab === 'Quests' && managerStyles.tabButtonActive]}
                    onPress={() => setActiveTab('Quests')}
                >
                    <Text style={[managerStyles.tabText, activeTab === 'Quests' && managerStyles.tabTextActive]}>
                        Quests ({quests.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[managerStyles.tabButton, activeTab === 'Skills' && managerStyles.tabButtonActive]}
                    onPress={() => setActiveTab('Skills')}
                >
                    <Text style={[managerStyles.tabText, activeTab === 'Skills' && managerStyles.tabTextActive]}>
                        Skills ({skills.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            {activeTab === 'Quests' ?
                <QuestsList
                    quests={quests}
                    skills={skills}
                    onEditQuest={handleEditQuest}
                    onDeleteQuest={handleDeleteQuest}
                    onToggleComplete={handleToggleComplete}
                />
                :
                <SkillsList
                    skills={skills}
                    onAddSkill={() => setIsSkillModalVisible(true)}
                    onEditSkill={handleEditSkill}
                    onDeleteSkill={handleDeleteSkill}
                />
            }


            {/* Floating Action Button (FAB) - For adding a new QUEST */}
            {activeTab === 'Quests' && skills.length > 0 && (
                <TouchableOpacity
                    style={managerStyles.fab}
                    onPress={() => {
                        setQuestToEdit(null); // Ensure we are in "Add" mode
                        setIsQuestModalVisible(true);
                    }}
                >
                    <Ionicons name="add" size={30} color={colors.bg} />
                </TouchableOpacity>
            )}

            {/* Helper message for Quests if no skills exist */}
            {activeTab === 'Quests' && skills.length === 0 && (
                <View style={managerStyles.fabNoSkills}>
                    <Text style={managerStyles.fabHelperText}>
                        Create a Skill first!
                    </Text>
                </View>
            )}


            {/* Modals (Imported Components) */}
            <AddEditQuestModal
                isVisible={isQuestModalVisible}
                onClose={() => setIsQuestModalVisible(false)}
                onSaveQuest={handleSaveQuest}
                skills={skills}
                questToEdit={questToEdit}
            />
            <AddSkillModal
                isVisible={isSkillModalVisible}
                onClose={() => setIsSkillModalVisible(false)}
                onAddSkill={handleAddSkill}
            />
        </SafeAreaView>
    );
};

// --- Stylesheet ---
// Note: Styles for nested components are simplified here for brevity; assume they are 
// defined and applied correctly within the component files or globally.

const managerStyles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.bg, paddingTop: 10, },
    header: { paddingHorizontal: 20, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: colors.bg, alignItems: 'center', },
    headerTitle: { fontFamily: fonts.bold, fontSize: 22, color: colors.text, },
    tabSelector: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: colors.bg, borderRadius: 12, padding: 4, marginVertical: 15, shadowColor: colors.secondary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 5, elevation: 3, },
    tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8, },
    tabButtonActive: { backgroundColor: colors.primary, },
    tabText: { fontFamily: fonts.medium, fontSize: 16, color: colors.light, },
    tabTextActive: { color: colors.bg, },
    tabContent: { flex: 1, paddingHorizontal: 20, },
    tabTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.text, marginBottom: 5, },
    tabSubtitle: { fontFamily: fonts.regular, fontSize: 14, color: colors.light, marginBottom: 20, },
    emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, paddingBottom: 120, },
    emptyStateTitle: { fontFamily: fonts.bold, fontSize: 20, color: colors.text, marginTop: 15, },
    emptyStateSubtitle: { fontFamily: fonts.regular, fontSize: 16, color: colors.light, textAlign: 'center', marginTop: 5, },
    fab: { position: 'absolute', bottom: 90, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 5, elevation: 5, },
    fabNoSkills: { position: 'absolute', bottom: 100, right: 30, backgroundColor: colors.light, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, },
    fabHelperText: { fontFamily: fonts.medium, color: colors.bg, fontSize: 14, }
});

const skillStyles = StyleSheet.create({
    addSkillButtonLarge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12, marginTop: 20, },
    addSkillTextLarge: { fontFamily: fonts.bold, fontSize: 18, color: colors.bg, marginLeft: 10, },
    addSkillCard: { width: '48.5%', height: 150, backgroundColor: colors.bg, borderRadius: 15, borderWidth: 2, borderColor: colors.light + '40', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 15, },
    addSkillText: { fontFamily: fonts.medium, fontSize: 14, color: colors.light, marginTop: 10, },
    skillCard: { width: '48.5%', height: 150, backgroundColor: colors.bg, borderRadius: 15, justifyContent: 'center', alignItems: 'center', shadowColor: colors.secondary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 4, position: 'relative', },
    iconWrapper: { width: 70, height: 70, borderRadius: 35, justifyContent: 'center', alignItems: 'center', marginBottom: 10, },
    skillTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.text, },
    skillDetail: { fontFamily: fonts.regular, fontSize: 12, color: colors.light, },
    skillCardOverlay: { position: 'absolute', top: 5, right: 5, flexDirection: 'row', zIndex: 10, },
    overlayButton: { backgroundColor: colors.primary + 'D0', width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 5, }
});

export default QuestsSkillsManager;
