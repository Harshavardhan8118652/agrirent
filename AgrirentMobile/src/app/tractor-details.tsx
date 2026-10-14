
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export default function TractorDetailsScreen() {
  const {
    equipmentId,
    name,
    category,
    price,
  } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.imageBox}>
        <Text style={styles.emoji}>🚜</Text>
      </View>

      <Text style={styles.title}>
        {name}
      </Text>

      <Text style={styles.category}>
        🏷️ Category: {category}
      </Text>

      <Text style={styles.price}>
  ₹{price} / day
</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>
          Equipment Information
        </Text>

        <Text style={styles.info}>
          🆔 Equipment ID: {equipmentId}
        </Text>

        <Text style={styles.info}>
          📦 Available for rental
        </Text>

        <Text style={styles.description}>
          Reliable agricultural equipment available
          for farming and agricultural work.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push({
            pathname: '/booking',
            params: {
              equipmentId: equipmentId,
              name: name,
              price: price,
            },
          });
        }}
      >
        <Text style={styles.buttonText}>
          📅 Book Now
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

  imageBox: {
    height: 200,
    backgroundColor: '#E8F5E9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  emoji: {
    fontSize: 90,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  category: {
    fontSize: 17,
    marginBottom: 12,
  },

  price: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },

  infoTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  info: {
    fontSize: 16,
    marginBottom: 10,
  },

  description: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5,
    color: '#555555',
  },

  button: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

