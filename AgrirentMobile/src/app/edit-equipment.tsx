import { useState } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useLocalSearchParams, useRouter } from 'expo-router';

const API_URL = 'http://10.3.11.46:8000';

export default function EditEquipmentScreen() {
  const router = useRouter();

  const { equipment_id, name, category, price_per_day } =
    useLocalSearchParams();

  const [equipmentName, setEquipmentName] = useState(
    String(name || '')
  );

  const [equipmentCategory, setEquipmentCategory] = useState(
    String(category || '')
  );

  const [price, setPrice] = useState(
    String(price_per_day || '')
  );

  const [loading, setLoading] = useState(false);

  const updateEquipment = async () => {
    if (!equipmentName || !equipmentCategory || !price) {
      Alert.alert(
        'Missing Details',
        'Please fill all fields.'
      );
      return;
    }

    try {
      setLoading(true);

      const url =
        `${API_URL}/equipment/${equipment_id}` +
        `?name=${encodeURIComponent(equipmentName)}` +
        `&category=${encodeURIComponent(equipmentCategory)}` +
        `&price_per_day=${encodeURIComponent(price)}`;

      const response = await fetch(url, {
        method: 'PUT',
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success',
          'Equipment updated successfully',
          [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ]
        );
      } else {
        Alert.alert(
          'Error',
          data.detail || 'Failed to update equipment'
        );
      }
    } catch (error) {
      console.log('Update equipment error:', error);

      Alert.alert(
        'Error',
        'Unable to update equipment'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Edit Equipment
      </Text>

      <Text style={styles.label}>
        Equipment Name
      </Text>

      <TextInput
        style={styles.input}
        value={equipmentName}
        onChangeText={setEquipmentName}
        placeholder="Enter equipment name"
      />

      <Text style={styles.label}>
        Category
      </Text>

      <TextInput
        style={styles.input}
        value={equipmentCategory}
        onChangeText={setEquipmentCategory}
        placeholder="Enter category"
      />

      <Text style={styles.label}>
        Price Per Day
      </Text>

      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price per day"
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={updateEquipment}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Updating...' : 'Update Equipment'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 18,
  },

  button: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});