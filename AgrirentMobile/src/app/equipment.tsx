import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';

export default function EquipmentScreen() {
  const [equipment, setEquipment] = useState<any[]>([]);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          'http://10.3.11.46:8000/equipment'
        );

        const data = await response.json();

        setEquipment(data);
      } catch (error) {
        console.log('EQUIPMENT ERROR:', error);
      }
    };

    fetchEquipment();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚜 Equipment</Text>

      <FlatList
        data={equipment}
        keyExtractor={(item) =>
          item.equipment_id.toString()
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.category}>
              Category: {item.category}
            </Text>

            <Text style={styles.price}>
              ₹{item.price_per_day} / day
            </Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
  router.push({
    pathname: '/tractor-details',
    params: {
      equipmentId: item.equipment_id,
      name: item.name,
      category: item.category,
      price: item.price_per_day,
    },
  })
}
            >
              <Text style={styles.buttonText}>
                View Details
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  category: {
    fontSize: 15,
    color: '#666666',
    marginBottom: 8,
  },

  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  button: {
    backgroundColor: '#2E7D32',
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});