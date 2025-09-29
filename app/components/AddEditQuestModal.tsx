import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { Quest, Skill, difficultyLevels } from './AppTypes';

type AddEditQuestModalProps = {
    isVisible: boolean;
    onClose: () => void;
    onSaveQuest: (quest: Quest) => void;
    skills: Skill[];
    questToEdit?: Quest | null;
}

const AddEditQuestModal = ({ isVisible, onClose, onSaveQuest, skills, questToEdit }: AddEditQuestModalProps) => {
    const initialDifficulty = difficultyLevels[0];
    const initialSkill = skills[0]?.id || '';

    const [title, setTitle] = useState(questToEdit?.title || '');
    const [selectedSkill, setSelectedSkill] = useState(questToEdit?.skillId || initialSkill);
    const [difficulty, setDifficulty] = useState(questToEdit?.difficulty || initialDifficulty.value);

    React.useEffect(() => {
        if (questToEdit) {
            setTitle(questToEdit.title);
            setSelectedSkill(questToEdit.skillId);
            setDifficulty(questToEdit.difficulty);
        } else {
            setTitle('');
            setSelectedSkill(initialSkill);
            setDifficulty(initialDifficulty.value);
        }
    }, [questToEdit, isVisible]);


    const handleSubmit = () => {
        if (!title.trim() || !selectedSkill || !difficulty) {
            console.error("All fields must be filled.");
            return;
        }

        const diffObj = difficultyLevels.find(d => d.value === difficulty) || initialDifficulty;
        
        const questData: Quest = {
            id: questToEdit?.id || Date.now().toString(),
            title,
            skillId: selectedSkill,
            difficulty: difficulty as 'Easy' | 'Medium' | 'Hard',
            xp: diffObj.xp,
            isDaily: true, 
            isComplete: questToEdit?.isComplete || false,
        };

        onSaveQuest(questData);
        onClose();
    };

    type Difficulty = Quest['difficulty']
    const getDifficultyColor = (diff: Difficulty) => difficultyLevels.find(d => d.value === diff)?.color || colors.light;

    if (skills.length === 0) {
        return null;
    }

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={modalStyles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={modalStyles.container}>
                            <Text style={modalStyles.title}>{questToEdit ? 'Edit Quest' : 'Create New Quest'}</Text>
                            
                            {/* Quest Title Input */}
                            <Text style={modalStyles.label}>Quest Name</Text>
                            <TextInput
                                style={modalStyles.input}
                                placeholder="E.g., Finish Chapter 3 of Book"
                                value={title}
                                onChangeText={setTitle}
                            />

                            {/* Skill Selector */}
                            <Text style={modalStyles.label}>Select Skill</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={modalStyles.chipContainer}>
                                {skills.map(skill => (
                                    <TouchableOpacity 
                                        key={skill.id} 
                                        style={[
                                            modalStyles.chip, 
                                            selectedSkill === skill.id && modalStyles.chipActive
                                        ]}
                                        onPress={() => setSelectedSkill(skill.id)}
                                    >
                                        <Text style={[
                                            modalStyles.chipText, 
                                            selectedSkill === skill.id && modalStyles.chipTextActive
                                        ]}>
                                            <Ionicons name={skill.icon as any} size={14} color={selectedSkill === skill.id ? colors.bg : colors.text} />
                                            {` ${skill.name}`}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            {/* Difficulty Selector */}
                            <Text style={modalStyles.label}>Difficulty & Base XP</Text>
                            <View style={modalStyles.difficultyContainer}>
                                {difficultyLevels.map(diff => (
                                    <TouchableOpacity 
                                        key={diff.value} 
                                        style={[
                                            modalStyles.difficultyOption,
                                            { backgroundColor: diff.value === difficulty ? diff.color : colors.bg },
                                            { borderWidth: diff.value === difficulty ? 0 : 1, borderColor: getDifficultyColor(diff.value as Quest['difficulty']) + '50' }
                                        ]}
                                        onPress={() => setDifficulty(diff.value as Quest['difficulty'])}
                                    >
                                        <Text style={[
                                            modalStyles.difficultyText,
                                            { color: diff.value === difficulty ? colors.bg : getDifficultyColor(diff.value as Quest['difficulty']) }
                                        ]}>
                                            {diff.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Submit Button */}
                            <TouchableOpacity style={modalStyles.submitButton} onPress={handleSubmit}>
                                <Text style={modalStyles.submitButtonText}>{questToEdit ? 'Save Changes' : 'Add Quest'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onClose} style={{ marginTop: 10 }}>
                                <Text style={modalStyles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.bg,
        padding: 25,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        width: '100%',
        maxHeight: '80%', 
    },
    title: {
        fontFamily: fonts.bold,
        fontSize: 22,
        color: colors.text,
        marginBottom: 20,
    },
    label: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: colors.text,
        marginTop: 15,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.light + '30',
        borderRadius: 10,
        padding: 12,
        fontFamily: fonts.regular,
        fontSize: 16,
        color: colors.text,
        backgroundColor: '#fff',
    },
    chipContainer: {
        paddingVertical: 5,
    },
    chip: {
        borderWidth: 1,
        borderColor: colors.light + '30',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginRight: 10,
        backgroundColor: colors.bg,
    },
    chipActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
    },
    chipText: {
        fontFamily: fonts.regular,
        fontSize: 14,
        color: colors.text,
    },
    chipTextActive: {
        color: colors.bg,
    },
    difficultyContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    difficultyOption: {
        flex: 1,
        marginHorizontal: 5,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    difficultyText: {
        fontFamily: fonts.bold,
        fontSize: 12,
    },
    submitButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        shadowColor: colors.primary,
        shadowOpacity: 0.3,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
    },
    submitButtonText: {
        fontFamily: fonts.bold,
        fontSize: 18,
        color: colors.bg,
    },
    cancelText: {
        fontFamily: fonts.medium,
        fontSize: 14,
        color: colors.light,
        textAlign: 'center',
    }
});

export default AddEditQuestModal;
