import { colors } from "../constants/theme";

// --- Types ---
export interface Skill {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface Quest {
    id: string;
    title: string;
    skillId: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    xp: number;
    isDaily: boolean;
    isComplete: boolean;
}

// --- Constants ---
export const difficultyLevels = [
    { label: 'Easy (5 XP)', value: 'Easy', color: '#10B981', xp: 5 }, // Green
    { label: 'Medium (10 XP)', value: 'Medium', color: '#F59E0B', xp: 10 }, // Amber
    { label: 'Hard (15 XP)', value: 'Hard', color: colors.primary, xp: 15 }, // Primary (Purple/Blue)
];

export const availableIcons = ['code-slash', 'barbell', 'book', 'leaf', 'time', 'bulb', 'laptop', 'brush'];

// Theme-coordinated colors for Skills 
export const availableColors = [
    colors.primary, 
    '#6C7BFF', // Lighter Primary
    '#3498DB', // Solid Blue
    '#F1C40F', // Bright Yellow
    '#E74C3C', // Coral Red (for contrast)
];

export const getRandomColor = () => availableColors[Math.floor(Math.random() * availableColors.length)];
