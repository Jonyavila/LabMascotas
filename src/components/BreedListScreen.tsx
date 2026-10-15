import React from 'react';
import {
    StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

type Props = {
    onSelectBreed: (breed: string) => void;
};

export default function BreedListScreen({ onSelectBreed }: Props) {
    const { data, isLoading, error } = useQuery({
        queryKey: ['breeds'],
        queryFn: async () => {
            const res = await fetch('https://dog.ceo/api/breeds/list/all');
            if (!res.ok) throw new Error('Error al cargar razas');
            const json = await res.json();
            return Object.keys(json.message) as string[];
        },
    });

    if (isLoading) return <ActivityIndicator size="large" style={styles.center} />;
    if (error) return <Text style={styles.center}>Error: {String(error)}</Text>;

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
                <TouchableOpacity
                    style={styles.item}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onSelectBreed(item);
                    }}
                >
                    <Text style={styles.itemText}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </Text>
                </TouchableOpacity>
            )}
        />
    );
}

const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    item: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
    itemText: { fontSize: 18, fontWeight: '500' },
});