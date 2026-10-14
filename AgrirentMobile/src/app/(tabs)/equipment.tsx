import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { router } from 'expo-router';

const categories = [
  {
    id: '1',
    name: '🚜 Tractors',
    description: 'Farm tractors and tractor equipment',
    category: 'Tractor',
  },
  {
    id: '2',
    name: '🌾 Harvesters',
    description: 'Harvesting machines',
    category: 'Harvester',
  },
  {
    id: '3',
    name: '💧 Pumps',
    description: 'Irrigation and water pumps',
    category: 'Pump',
  },
];

export default function EquipmentScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Available Equipment
      </Text>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: '/category-equipment',
                params: {
                  category: item.category,
                },
              });
            }}
          >
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
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
    padding: 22,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  description: {
    fontSize: 15,
    marginTop: 8,
    color: '#555555',
  },
});