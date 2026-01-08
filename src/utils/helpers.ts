// Placeholder file for utility functions
// Add your helper functions here

export const formatDate = (date: Date): string => {
    return date.toLocaleDateString();
};

export const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
