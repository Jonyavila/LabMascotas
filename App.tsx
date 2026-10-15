/* import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, FlatList, TouchableOpacity,
  Image, ActivityIndicator, Alert, ScrollView, Button,
} from 'react-native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import * as Haptics from 'expo-haptics';

const queryClient = new QueryClient();

// ---- Pantalla Lista ----
function BreedListScreen({ onSelectBreed }: { onSelectBreed: (b: string) => void }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['breeds'],
    queryFn: async () => {
      const res = await fetch('https://dog.ceo/api/breeds/list/all');
      if (!res.ok) throw new Error('Error al cargar razas');
      const json = await res.json();
      return Object.keys(json.message);
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

// ---- Pantalla Detalle ----
function BreedDetailScreen({ breed, onBack }: { breed: string; onBack: () => void }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: images, isLoading, error } = useQuery({
    queryKey: ['breedImages', breed],
    queryFn: async () => {
      const res = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
      if (!res.ok) throw new Error('Error al cargar imágenes');
      const json = await res.json();
      return json.message.slice(0, 12);
    },
  });

  useEffect(() => {
    (async () => {
      const saved = await SecureStore.getItemAsync('favorites');
      if (saved) {
        const favs = JSON.parse(saved);
        setIsFavorite(favs.includes(breed));
      }
    })();
  }, [breed]);

  const toggleFavorite = async () => {
    try {
      // 1. Primero vibra
      await Haptics.notificationAsync(
        isFavorite
          ? Haptics.NotificationFeedbackType.Warning
          : Haptics.NotificationFeedbackType.Success
      );

      // 2. Solo si la vibración funcionó, guarda
      const saved = await SecureStore.getItemAsync('favorites');
      let favs: string[] = saved ? JSON.parse(saved) : [];

      if (isFavorite) {
        favs = favs.filter((f) => f !== breed);
      } else {
        favs.push(breed);
      }

      await SecureStore.setItemAsync('favorites', JSON.stringify(favs));
      setIsFavorite(!isFavorite);
      Alert.alert('Listo', isFavorite ? 'Eliminado' : 'Guardado');
    } catch (e) {
      Alert.alert('Error', 'No se pudo completar la acción');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="← Volver" onPress={onBack} />
        <Button
          title={isFavorite ? '❤️ Quitar' : '🤍 Guardar'}
          onPress={toggleFavorite}
          color={isFavorite ? '#e74c3c' : '#3498db'}
        />
      </View>
      <Text style={styles.title}>{breed.toUpperCase()}</Text>
      <ScrollView>
        <View style={styles.gallery}>
          {images?.map((url: string, i: number) => (
            <Image key={i} source={{ uri: url }} style={styles.image} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

// ---- App ----
export default function App() {
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {selectedBreed ? (
          <BreedDetailScreen breed={selectedBreed} onBack={() => setSelectedBreed(null)} />
        ) : (
          <BreedListScreen onSelectBreed={setSelectedBreed} />
        )}
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemText: { fontSize: 18, fontWeight: '500' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 15 },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', padding: 5 },
  image: { width: 160, height: 160, margin: 5, borderRadius: 10 },
}); */

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/libs/queryclient';
import BreedListScreen from './src/components/BreedListScreen';
import BreedDetailScreen from './src/components/BreedDetailScreen';

export default function App() {
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);

  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        {selectedBreed ? (
          <BreedDetailScreen
            breed={selectedBreed}
            onBack={() => setSelectedBreed(null)}
          />
        ) : (
          <BreedListScreen onSelectBreed={setSelectedBreed} />
        )}
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});