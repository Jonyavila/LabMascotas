import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, Image, ActivityIndicator,
    ScrollView, Button, Alert,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';
import AnimatedDog from '../components/animatedDog';

type Props = {
    breed: string;
    onBack: () => void;
};

export default function BreedDetailScreen({ breed, onBack }: Props) {
    const [isFavorite, setIsFavorite] = useState(false);
    const [trigger, setTrigger] = useState(0); 

    const { data: images, isLoading, error } = useQuery({
        queryKey: ['breedImages', breed],
        queryFn: async () => {
            const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
            if (!res.ok) throw new Error('Error al cargar imágenes');
            const json = await res.json();
            return json.message.slice(0, 12) as string[];
        },
    });

    
    useEffect(() => {
        (async () => {
            const saved = await SecureStore.getItemAsync('favorites');
            if (saved) {
                const favs: string[] = JSON.parse(saved);
                setIsFavorite(favs.includes(breed));
            }
        })();
    }, [breed]);

    const toggleFavorite = async () => {
        try {
            
            await Haptics.notificationAsync(
                isFavorite
                    ? Haptics.NotificationFeedbackType.Warning
                    : Haptics.NotificationFeedbackType.Success
            );

        
            const saved = await SecureStore.getItemAsync('favorites');
            let favs: string[] = saved ? JSON.parse(saved) : [];

            if (isFavorite) {
                favs = favs.filter((f) => f !== breed);
            } else {
                favs.push(breed);
            }

            await SecureStore.setItemAsync('favorites', JSON.stringify(favs));
            setIsFavorite(!isFavorite);

        
            setTrigger((t) => t + 1);
        } catch (e) {
            Alert.alert('Error', 'No se pudo completar la acción');
        }
    };

    if (isLoading) return <ActivityIndicator size="large" style={styles.center} />;
    if (error) return <Text style={styles.center}>Error: {String(error)}</Text>;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Button title="← Volver" onPress={onBack} />
                <Button
                    title={isFavorite ? '❤️ Quitar' : '🤍 Guardar'}
                    onPress={toggleFavorite}
                    color={isFavorite ? '#e63622' : '#2d95da'}
                />
            </View>

            <Text style={styles.title}>{breed.toUpperCase()}</Text>

        
            <AnimatedDog trigger={trigger} />

            <ScrollView>
                <View style={styles.gallery}>
                    {images?.map((url, i) => (
                        <Image key={i} source={{ uri: url }} style={styles.image} />
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
    gallery: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 5 },
    image: { width: 160, height: 160, margin: 5, borderRadius: 10 },
});