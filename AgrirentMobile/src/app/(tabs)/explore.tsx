import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore AgriRent 🌱</Text>

        <Text style={styles.subtitle}>
          Discover farming equipment and manage rentals easily.
        </Text>
      </View>

      {/* Browse Equipment */}
      <TouchableOpacity
        style={styles.mainCard}
        onPress={() => router.push('/equipment')}
      >
        <Text style={styles.cardIcon}>🚜</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Browse Equipment</Text>

          <Text style={styles.cardText}>
            Find tractors, harvesters and pumps available for rent.
          </Text>
        </View>
      </TouchableOpacity>

      {/* Owner Section */}
      <TouchableOpacity
        style={styles.mainCard}
        onPress={() => router.push('/owner-equipment')}
      >
        <Text style={styles.cardIcon}>🏠</Text>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Manage My Equipment</Text>

          <Text style={styles.cardText}>
            Add equipment, check availability and manage your listings.
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>How AgriRent Works</Text>

      <View style={styles.stepCard}>
        <Text style={styles.stepNumber}>1</Text>

        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Find Equipment</Text>

          <Text style={styles.stepText}>
            Browse equipment by category and choose what you need.
          </Text>
        </View>
      </View>

      <View style={styles.stepCard}>
        <Text style={styles.stepNumber}>2</Text>

        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Choose Dates</Text>

          <Text style={styles.stepText}>
            Select your start date and end date for the rental.
          </Text>
        </View>
      </View>

      <View style={styles.stepCard}>
        <Text style={styles.stepNumber}>3</Text>

        <View style={styles.stepContent}>
          <Text style={styles.stepTitle}>Confirm Booking</Text>

          <Text style={styles.stepText}>
            Confirm the booking and track it from My Bookings.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Why AgriRent?</Text>

      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🔎</Text>
          <Text style={styles.featureTitle}>Easy Search</Text>
          <Text style={styles.featureText}>
            Find suitable farming equipment quickly.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📅</Text>
          <Text style={styles.featureTitle}>Easy Booking</Text>
          <Text style={styles.featureText}>
            Select dates and book equipment easily.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>📋</Text>
          <Text style={styles.featureTitle}>Track Bookings</Text>
          <Text style={styles.featureText}>
            View booking details and status anytime.
          </Text>
        </View>

        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>🤝</Text>
          <Text style={styles.featureTitle}>For Owners</Text>
          <Text style={styles.featureText}>
            Manage your equipment and rental requests.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 20,
  },

  header: {
    marginTop: 50,
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
  },

  subtitle: {
    fontSize: 15,
    color: '#666',
    marginTop: 8,
    lineHeight: 21,
  },

  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  cardIcon: {
    fontSize: 38,
    marginRight: 15,
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#333',
  },

  cardText: {
    fontSize: 14,
    color: '#666',
    marginTop: 6,
    lineHeight: 19,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 18,
    marginBottom: 12,
  },

  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  stepNumber: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2E7D32',
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 14,
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },

  stepText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    lineHeight: 19,
  },

  featureGrid: {
    marginBottom: 30,
  },

  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  featureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },

  featureTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },

  featureText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    lineHeight: 19,
  },
});