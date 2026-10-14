import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';

const equipment = [
  {
    id: '1',
    name: '🚜 Mahindra Tractor',
    category: 'Tractor',
    price: '3000',
  },
  {
    id: '2',
    name: '🚜 John Deere Tractor',
    category: 'Tractor',
    price: '3500',
  },
  {
    id: '3',
    name: '🌾 Combine Harvester',
    category: 'Harvester',
    price: '7000 ',
  },
  {
    id: '4',
    name: '💧 Water Pump',
    category: 'Pump',
    price: '500',
  },
];

export default function CategoryEquipmentScreen() {
  const { category } = useLocalSearchParams();

  const filteredEquipment = equipment.filter(
    (item) => item.category === category
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {category} Equipment
      </Text>

      <FlatList
        data={filteredEquipment}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              router.push({
                pathname: '/tractor-details',
                params: {
                  equipmentId: item.id,
                  name: item.name,
                  category: item.category,
                  price: item.price,
                },
              });
            }}
          >
            <Text style={styles.name}>
              {item.name}
            </Text>

            <Text style={styles.category}>
              🏷️ {item.category}
            </Text>

            <Text style={styles.price}>
              {item.price}
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
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  name: {
    fontSize: 21,
    fontWeight: 'bold',
  },

  category: {
    fontSize: 15,
    marginTop: 8,
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10,
  },
});