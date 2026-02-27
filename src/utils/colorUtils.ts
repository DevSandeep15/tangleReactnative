import { Colors } from '../constants/colors';

const AVATAR_BG_COLORS = [
    Colors.skyBlue,
    Colors.pink,
    Colors.darkgreen
];

/**
 * Returns a consistent background color for avatars based on the provided ID.
 * If no ID is provided, returns a random color from the predefined set.
 */
export const getRandomAvatarColor = (id?: string): string => {
    if (!id) {
        return AVATAR_BG_COLORS[Math.floor(Math.random() * AVATAR_BG_COLORS.length)];
    }

    // Hash the ID to get a consistent index
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % AVATAR_BG_COLORS.length;
    return AVATAR_BG_COLORS[index];
};
