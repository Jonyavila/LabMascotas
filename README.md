# 🐶 laboratorio labMascotas

Aplicación móvil hecha con **React Native + Expo** que explora razas de perros usando la **Dog CEO API**. Permite ver una lista de razas, entrar al detalle con galería de fotos y guardar favoritos de forma persistente.

**Laboratorio de Librerías — Aplicaciones Móviles**
**Alumno:** Jonathan Avila
**Fecha:** Jueves 15 de octubre

---

## 📋 Ficha personal

| Origen | Dato | Tabla | Librería asignada |
|---|---|---|---|
| Nombre | **J** | Tabla A (I–J) | **5 · expo-secure-store** |
| Apellido | **A** | Tabla B (A–B) | **7 · @tanstack/react-query** |
| Mes | **Febrero** | Tabla C | **5 · expo-secure-store** → repetida → **6 · expo-haptics** |

**Librerías finales:**
1. `expo-secure-store`
2. `@tanstack/react-query`
3. `expo-haptics`

**API:** Dog CEO (`https://dog.ceo/api`)

---

## 🎯 Funcionalidad

La app tiene tres partes integradas en un mismo flujo:

1. **Pantalla de lista** — muestra todas las razas de perros que devuelve la API.
2. **Pantalla de detalle** — al tocar una raza, muestra una galería con sus fotos.
3. **Acción del usuario** — botón "Guardar/Quitar" que persiste el favorito en el celular.

Si se saca cualquiera de las tres librerías, la app deja de funcionar.

---

## 🧩 Rol de cada librería

### 1. `@tanstack/react-query`
Trae los datos de la API y maneja los estados de carga y error sin usar `useState` ni `useEffect`.
- `['breeds']` → lista de razas
- `['breedImages', breed]` → imágenes de cada raza

### 2. `expo-secure-store`
Guarda la lista de favoritos de forma cifrada en el Keychain (iOS) o Keystore (Android). Solo acepta strings, así que uso `JSON.stringify` / `JSON.parse`.

### 3. `expo-haptics`
Da respuesta táctil al usuario. Vibra al tocar una raza (`impactAsync`) y al guardar/eliminar un favorito (`notificationAsync`). Está dentro del mismo `try` que el guardado: si falla, no se guarda nada. Por eso es parte del flujo, no decoración.

### Bonus: `Animated` (nativo de React Native)
La animación del perro 🐶 usa `Animated` nativo, no una cuarta librería. Salta cada vez que guardás o quitás un favorito.

---

## 🛠️ Instalación y ejecución

```bash
# 1. Clonar el repo
git clone https://github.com/TU-USUARIO/DogExplorer.git
cd DogExplorer

# 2. Instalar dependencias
npm install

# 3. Instalar librerías nativas de Expo
npx expo install expo-secure-store expo-haptics

# 4. Arrancar
npx expo start
