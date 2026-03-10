import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '../../constants/colors';
import { Theme } from '../../constants/theme';

interface Props {
    children?: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }
            return (
                <View style={styles.container}>
                    <Text style={styles.title}>Something went wrong.</Text>
                    <Text style={styles.subtitle}>A component failed to load.</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.setState({ hasError: false })}
                    >
                        <Text style={styles.buttonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        padding: Theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF0F0',
        borderRadius: Theme.borderRadius.lg,
        margin: Theme.spacing.md,
        borderWidth: 1,
        borderColor: '#FFD1D1',
    },
    title: {
        fontSize: Theme.fontSize.md,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.error,
    },
    subtitle: {
        fontSize: Theme.fontSize.sm,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    button: {
        marginTop: Theme.spacing.sm,
        paddingHorizontal: Theme.spacing.md,
        paddingVertical: Theme.spacing.xs,
        backgroundColor: Colors.primary,
        borderRadius: Theme.borderRadius.sm,
    },
    buttonText: {
        color: Colors.white,
        fontSize: Theme.fontSize.xs,
        fontFamily: Theme.fontFamily.semiBold,
    }
});

export default ErrorBoundary;
