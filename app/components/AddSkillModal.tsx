import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { colors, fonts } from '../constants/theme';
import { Skill, availableIcons, getRandomColor } from './AppTypes';

type AddSkillModalProps = { isVisible: boolean; onClose: () => void; onAddSkill: (skill: Skill) => void }

const AddSkillModal = ({ isVisible, onClose, onAddSkill }: AddSkillModalProps) => {
    const [name, setName] = useState('');
    const [icon, setIcon] = useState(availableIcons[0]);

    const handleSubmit = () => {
        if (!name.trim()) {
            console.error("Skill name cannot be empty.");
            return;
        }
        const newSkill: Skill = {
            id: Date.now().toString(), 
            name,
            icon: icon,
            color: getRandomColor(), // Use theme-coordinating color
        };
        onAddSkill(newSkill);
        setName('');
        onClose();
    };

    return (
        <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={modalStyles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={modalStyles.container}>
                            <Text style={modalStyles.title}>Create New Skill</Text>
                            
                            <Text style={modalStyles.label}>Skill Name</Text>
                            <TextInput
                                style={modalStyles.input}
                                placeholder="E.g., Coding, Fitness, Writing"
                                value={name}
                                onChangeText={setName}
                            />

                            <Text style={modalStyles.label}>Select Icon</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={modalStyles.chipContainer}>
                                {availableIcons.map(item => (
                                    <TouchableOpacity 
                                        key={item} 
                                        style={[
                                            modalStyles.iconChip, 
                                            icon === item && modalStyles.chipActive
                                        ]}
                                        onPress={() => setIcon(item)}
                                    >
                                        <Ionicons name={item as any} size={24} color={icon === item ? colors.bg : colors.text} />
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                            
                            <TouchableOpacity style={modalStyles.submitButton} onPress={handleSubmit}>
                                <Text style={modalStyles.submitButtonText}>Create Skill</Text>
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
    iconChip: {
        borderWidth: 1,
        borderColor: colors.light + '30',
        borderRadius: 20,
        padding: 8,
        marginRight: 10,
        backgroundColor: colors.bg,
    },
    chipActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary,
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

export default AddSkillModal;
