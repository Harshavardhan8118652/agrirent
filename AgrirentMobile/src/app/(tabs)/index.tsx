import React, { useEffect, useState } from 'react';
import { router } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [equipment, setEquipment] = useState<any[]>([]);
  const filteredEquipment = equipment.filter((item) => {
  const query = search.toLowerCase().trim();

  return (
    String(item.name || '').toLowerCase().includes(query) ||
    String(item.category || '').toLowerCase().includes(query) ||
    String(item.brand || '').toLowerCase().includes(query) ||
    String(item.model || '').toLowerCase().includes(query)
  );
});

    useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch(
          'http://10.3.11.46:8000/equipment'
        );

        const data = await response.json();

        setEquipment(data);
      } catch (error) {
        console.log('HOME EQUIPMENT ERROR:', error);
      }
    };

    fetchEquipment();
  }, []);
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.title}>AgriRent</Text>
          </View>

          <TouchableOpacity
  style={styles.profileButton}
  onPress={() => router.push('/profile')}
>
  <Text style={styles.profileIcon}>👤</Text>
</TouchableOpacity>

<TouchableOpacity
  style={styles.profileButton}
  onPress={() => router.push('/notifications')}
>
  <Text style={styles.profileIcon}>🔔</Text>
</TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
  placeholder="Search equipment..."
  placeholderTextColor="#888"
  style={styles.searchInput}
  value={search}
  onChangeText={setSearch}
/>
        </View>

        {search.length > 0 && (
  <View style={styles.searchResult}>
    {filteredEquipment.length > 0 ? (
      filteredEquipment.map((item) => (
        <View key={item.equipment_id || item.id}>
          <Text style={styles.searchResultText}>
            {item.name}
          </Text>

          <TouchableOpacity
            style={styles.searchResultButton}
            onPress={() =>
              router.push({
                pathname: '/category-equipment',
                params: {
                  category: item.category,
                },
              })
            }
          >
            <Text style={styles.searchResultButtonText}>
              View Equipment
            </Text>
          </TouchableOpacity>
        </View>
      ))
    ) : (
      <Text style={styles.searchResultText}>
        No equipment found
      </Text>
    )}
  </View>
)}

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>
            Find the right equipment 🚜
          </Text>

          <Text style={styles.welcomeText}>
            Rent farming equipment from nearby owners easily.
          </Text>

          <TouchableOpacity
          style={styles.browseButton}
          onPress={() => router.push('/equipment')}

          >
            <Text style={styles.browseText}>Browse Equipment</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          <TouchableOpacity
  style={styles.categoryCard}
  onPress={() =>
    router.push({
      pathname: '/category-equipment',
      params: {
        category: 'Tractor',
      },
    })
  }
>
  <Text style={styles.categoryIcon}>🚜</Text>
  <Text style={styles.categoryText}>Tractors</Text>
</TouchableOpacity>

          <TouchableOpacity
  style={styles.categoryCard}
  onPress={() => router.push('/equipment')}
>
  <Text style={styles.categoryIcon}>🌾</Text>
  <Text style={styles.categoryText}>Harvesters</Text>
</TouchableOpacity>

          <TouchableOpacity
  style={styles.categoryCard}
  onPress={() => router.push('/equipment')}
>
  <Text style={styles.categoryIcon}>💧</Text>
  <Text style={styles.categoryText}>Pumps</Text>
</TouchableOpacity>

          <TouchableOpacity
  style={styles.categoryCard}
  onPress={() => router.push('/equipment')}
>
  <Text style={styles.categoryIcon}>🛠️</Text>
  <Text style={styles.categoryText}>Tools</Text>
</TouchableOpacity>
        </ScrollView>

        {/* Popular Equipment */}
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Equipment</Text>
          <TouchableOpacity onPress={() => router.push('/equipment')}>
  <Text style={styles.viewAll}>View All</Text>
</TouchableOpacity>
        </View>

        <View style={styles.equipmentCard}>
          <View style={styles.equipmentImage}>
            <Text style={styles.equipmentEmoji}>🚜</Text>
          </View>

          <View style={styles.equipmentInfo}>
            <Text style={styles.equipmentName}>Tractor</Text>
            <Text style={styles.location}>📍 Nearby</Text>
            <Text style={styles.price}>₹3000/ day</Text>
          </View>

          <TouchableOpacity
  style={styles.rentButton}
  onPress={() =>
    router.push({
      pathname: '/booking',
      params: {
        equipmentId: '1',
        name: 'Mahindra Tractor',
        price: '3000',
      },
    })
  }
>
  <Text style={styles.rentText}>Rent</Text>
</TouchableOpacity>
        </View>

      </ScrollView>
              <TouchableOpacity
          style={styles.addEquipmentButton}
          onPress={() => router.push('/add-equipment')}
        >
          <Text style={styles.addEquipmentText}>
            ➕ Add Equipment
          </Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F8F2',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 15,
  },

  greeting: {
    fontSize: 15,
    color: '#666',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 2,
  },

  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#E4F0E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileIcon: {
    fontSize: 22,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },

  welcomeCard: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 18,
    padding: 20,
  },

  welcomeTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },

  welcomeText: {
    color: '#E8F5E9',
    fontSize: 14,
    marginTop: 8,
    lineHeight: 20,
  },

  browseButton: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9,
    marginTop: 15,
  },

  browseText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },

  categoryScroll: {
    marginTop: 12,
    paddingLeft: 20,
  },

  categoryCard: {
    width: 105,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  categoryIcon: {
    fontSize: 32,
    marginBottom: 7,
  },

  categoryText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },

  viewAll: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '600',
  },

  equipmentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 15,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },

  equipmentImage: {
    width: 85,
    height: 85,
    backgroundColor: '#EAF4E8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  equipmentEmoji: {
    fontSize: 45,
  },

  equipmentInfo: {
    flex: 1,
    marginLeft: 12,
  },

  equipmentName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },

  location: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
  },

  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginTop: 7,
  },

  rentButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 8,
  },

  rentText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

    addEquipmentButton: {
    backgroundColor: '#2E7D32',
    marginHorizontal: 20,
    marginBottom: 30,
    height: 52,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addEquipmentText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

    searchResult: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  searchResultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },

  searchResultButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },

  searchResultButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});