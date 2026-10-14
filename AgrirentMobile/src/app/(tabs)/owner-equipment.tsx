import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';

import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const API_URL = 'http://10.3.11.46:8000';

type Equipment = {
  equipment_id: number;
  owner_id: number;
  name: string;
  category: string;
  brand: string | null;
  model: string | null;
  price_per_hour: number | null;
  price_per_day: number;
  availability: number;
};

export default function OwnerEquipmentScreen() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const ownerId = 1;

  useFocusEffect(
  useCallback(() => {
    fetchOwnerEquipment();
  }, [])
);

  const deleteEquipment = async (equipmentId: number) => {
    try {
      const response = await fetch(
        `${API_URL}/equipment/${equipmentId}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success',
          'Equipment deleted successfully'
        );

        fetchOwnerEquipment();
      } else {
        Alert.alert(
          'Error',
          data.detail || 'Failed to delete equipment'
        );
      }
    } catch (error) {
      console.log('Delete equipment error:', error);

      Alert.alert(
        'Error',
        'Unable to delete equipment'
      );
    }
  };

    const updateAvailability = async (
    equipmentId: number,
    availability: number
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/equipment/${equipmentId}/availability?availability=${availability}`,
        {
          method: 'PUT',
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Success',
          'Equipment availability updated successfully'
        );

        fetchOwnerEquipment();
      } else {
        Alert.alert(
          'Error',
          data.detail || 'Failed to update availability'
        );
      }
    } catch (error) {
      console.log(
        'Update availability error:',
        error
      );

      Alert.alert(
        'Error',
        'Unable to update availability'
      );
    }
  };

  const fetchOwnerEquipment = async () => {
    try {
      const response = await fetch(
        `${API_URL}/owner-equipment/${ownerId}`
      );

      const data = await response.json();

      if (response.ok) {
        setEquipment(data);
      } else {
        console.log('Owner equipment error:', data);
      }
    } catch (error) {
      console.log('Error fetching owner equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderEquipment = ({ item }: { item: Equipment }) => (
      < TouchableOpacity
    style={styles.card}
    onPress={() =>
      router.push({
        pathname: '/edit-equipment',
        params: {
          equipment_id: item.equipment_id.toString(),
          name: item.name,
          category: item.category,
          price_per_day: item.price_per_day.toString(),
        },
      })
    }
  >


      <Text style={styles.title}>
        🚜 {item.name}
      </Text>

      <Text style={styles.info}>
        📂 Category: {item.category}
      </Text>

      {item.brand && (
        <Text style={styles.info}>
          🏷️ Brand: {item.brand}
        </Text>
      )}

      {item.model && (
        <Text style={styles.info}>
          🔧 Model: {item.model}
        </Text>
      )}

      <Text style={styles.price}>
        💰 ₹{item.price_per_day} / day
      </Text>

      <Text
        style={[
          styles.availability,
          {
            color:
              item.availability === 1
                ? '#2e7d32'
                : '#c62828',
          },
        ]}
      >
        {item.availability === 1
          ? 'AVAILABLE'
          : 'NOT AVAILABLE'}
      </Text>

            <TouchableOpacity
        style={styles.availabilityButton}
        onPress={() =>
          updateAvailability(
            item.equipment_id,
            item.availability === 1 ? 0 : 1
          )
        }
      >
        <Text style={styles.availabilityButtonText}>
          {item.availability === 1
            ? '🔴 Mark Unavailable'
            : '🟢 Mark Available'}
        </Text>
      </TouchableOpacity>

            <TouchableOpacity
        style={styles.deleteButton}
        onPress={() =>
          Alert.alert(
            'Delete Equipment',
            'Are you sure you want to delete this equipment?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Delete',
                style: 'destructive',
                onPress: () =>
                  deleteEquipment(item.equipment_id),
              },
            ]
          )
        }
      >
        <Text style={styles.deleteButtonText}>
           Delete Equipment
        </Text>
      </TouchableOpacity>
        </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading your equipment...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Equipment</Text>

      {equipment.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>
            No equipment found.
          </Text>
        </View>
      ) : (
        <FlatList
          data={equipment}
          keyExtractor={(item) =>
            item.equipment_id.toString()
          }
          renderItem={renderEquipment}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },

  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  list: {
    paddingBottom: 20,
  },

  card: {
    backgroundColor: '#ffffff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 3,
  },

  title: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  info: {
    fontSize: 15,
    marginBottom: 6,
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 8,
  },

  availability: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 10,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },

  emptyText: {
    fontSize: 18,
    color: '#666',
  },

    deleteButton: {
    backgroundColor: '#c62828',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },

  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

    availabilityButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },

  availabilityButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});