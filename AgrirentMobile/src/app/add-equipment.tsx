import { useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddEquipmentScreen() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [ownerId, setOwnerId] = useState('1');
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const handleAddEquipment = async () => {
    const { status } =
  await Location.requestForegroundPermissionsAsync();

if (status !== 'granted') {
  Alert.alert(
    'Location Permission',
    'Location permission is required to add equipment.'
  );
  return;
}

const location = await Location.getCurrentPositionAsync({});

setLatitude(location.coords.latitude);
setLongitude(location.coords.longitude);
    if (!name || !category || !price || !ownerId) {
      Alert.alert('Missing Details', 'Please fill all fields.');
      return;
    }

    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('access_token');
      const locationResponse = await fetch(
  `http://10.3.11.46:8000/users/location?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

if (!locationResponse.ok) {
  const errorText = await locationResponse.text();

  Alert.alert(
    'Location Update Failed',
    errorText || 'Could not save owner location.'
  );

  return;
}

      const response = await fetch(
      'http://10.3.11.46:8000/equipment',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
          body: JSON.stringify({
            name: name,
            category: category,
            price_per_day: Number(price),
            owner_id: Number(ownerId),
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        Alert.alert(
          'Failed',
          data.detail || 'Could not add equipment.'
        );
        return;
      }

      Alert.alert(
        'Success',
        'Equipment added successfully!'
      );

      setName('');
      setCategory('');
      setPrice('');
    } catch (error) {
      console.log('ADD EQUIPMENT ERROR:', error);

      Alert.alert(
        'Connection Error',
        'Could not connect to AgriRent server.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add Equipment</Text>

      <Text style={styles.label}>Equipment Name</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: Mahindra Tractor"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Category</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: Tractor"
        value={category}
        onChangeText={setCategory}
      />

      <Text style={styles.label}>Price Per Day</Text>

      <TextInput
        style={styles.input}
        placeholder="Example: 3000"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Owner ID</Text>

      <TextInput
  style={styles.input}
  keyboardType="numeric"
  value={ownerId}
  editable={false}
/>

      <TouchableOpacity
        style={styles.button}
        onPress={handleAddEquipment}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Adding...' : 'Add Equipment'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  input: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D5D5D5',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  button: {
    backgroundColor: '#2E7D32',
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});