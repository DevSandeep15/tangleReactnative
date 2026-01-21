import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, StatusBar, DeviceEventEmitter } from 'react-native';
import { useAppSelector } from '../../../store/hooks';
import { Colors } from '../../../constants/colors';
import { Theme } from '../../../constants/theme';
import type { HomeScreenProps } from '../../../navigation/types';
import DashHeader from '../../../components/dashHeader/DashHeader';
import RecommendedCard from './RecommendedCard';
import CategoryFilters from './CategoryFilters';
import PostCard from './PostCard';
import { moderateScale } from 'react-native-size-matters';
import { IMAGES } from '../../../constants/images';

const RECOMMENDED_DATA = [
    { id: '1', name: 'Suresh', role: 'Science Teacher', image: IMAGES.dummyAvatar },
    { id: '2', name: 'Apoorva', role: 'Dance Teacher', image: IMAGES.dummyAvatar },
    { id: '3', name: 'Joshep', role: 'Software Engineer', image: IMAGES.dummyAvatar },
    { id: '4', name: 'Apoorva', role: 'Dance Teacher', image: IMAGES.dummyAvatar },
];

const POSTS_DATA = [
    {
        id: '1',
        authorName: 'Ishani verma',
        authorAvatar: 'https://i.pravatar.cc/150?u=ishani',
        timeAgo: '30 mins ago',
        tag: 'Discussion',
        content: "finally met the faces I've been walking past for months\nsmall starts, good energy, new connections",
        hashtags: ['TangleTogether', 'CommunityVibes'],
        postImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
        views: 142,
        likes: 20,
        comments: 20,
    },
    {
        id: '2',
        authorName: 'Ishani verma',
        authorAvatar: 'https://i.pravatar.cc/150?u=ishani',
        timeAgo: '30 mins ago',
        tag: 'Discussion',
        content: "finally met the faces I've been walking past for months\nsmall starts, good energy, new connections",
        hashtags: ['TangleTogether', 'CommunityVibes'],
        postImage: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=800',
        views: 142,
        likes: 20,
        comments: 20,
    }
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = React.useState('All');
    const { user } = useAppSelector(state => state.auth);

    const filteredPosts = React.useMemo(() => {
        if (selectedCategory === 'All') return POSTS_DATA;
        return POSTS_DATA.filter(post => post.tag === selectedCategory);
    }, [selectedCategory]);

    const handleCommentPress = () => {
        DeviceEventEmitter.emit('OPEN_COMMENTS');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <DashHeader
                userName={user?.name || "User"}
                userAvatar={user?.emoji}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onChatPress={() => navigation.navigate('Inbox')}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Recommended Section */}
                <View style={styles.sectionHeader}>
                    <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedText}>Recommended 👥</Text>
                    </View>
                </View>

                <FlatList
                    data={RECOMMENDED_DATA}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <RecommendedCard
                            name={item.name}
                            role={item.role}
                            image={item.image}
                        />
                    )}
                    contentContainerStyle={styles.recommendedList}
                />

                {/* Categories */}
                <CategoryFilters
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                {/* Posts Feed */}
                <View style={styles.feedContainer}>
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post.id}
                            {...post}
                            onCommentPress={handleCommentPress}
                        />
                    ))}
                    {filteredPosts.length === 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No posts in this category</Text>
                        </View>
                    )}
                </View>

                <View style={{ height: moderateScale(20) }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    sectionHeader: {
        paddingHorizontal: Theme.spacing.md,
        marginTop: Theme.spacing.sm,
        marginBottom: Theme.spacing.sm,
    },
    recommendedBadge: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Theme.spacing.sm,
        paddingVertical: Theme.spacing.xs,
        borderRadius: Theme.borderRadius.md,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        backgroundColor: Colors.white,
    },
    recommendedText: {
        fontSize: Theme.fontSize.sm,
        fontFamily: Theme.fontFamily.bold,
        color: Colors.text,
    },
    recommendedList: {
        paddingHorizontal: Theme.spacing.md,
    },
    feedContainer: {
        flex: 1,
    },
    emptyContainer: {
        padding: Theme.spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: Theme.fontSize.md,
        fontFamily: Theme.fontFamily.medium,
        color: Colors.textSecondary,
    },
});

export default HomeScreen;
