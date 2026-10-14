
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';

export default function BookingScreen() {
  const { equipmentId, name, price } = useLocalSearchParams();

  const equipmentPrice = Number(price) || 0;

  const [startDate, setStartDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);

  const [endDate, setEndDate] = useState(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [isBooking, setIsBooking] = useState(false);

  const calculateDays = () => {
    const difference =
      endDate.getTime() - startDate.getTime();

    const days =
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      ) + 1;

    return days < 1 ? 1 : days;
  };

  const totalAmount =
    calculateDays() * equipmentPrice;

  const handleStartDateChange = (
    event: any,
    selectedDate?: Date
  ) => {
    setShowStartPicker(false);

    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (
    event: any,
    selectedDate?: Date
  ) => {
    setShowEndPicker(false);

    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        📅 Book Equipment
      </Text>

      <Text style={styles.equipment}>
        🚜 {name}
      </Text>

      <Text style={styles.price}>
        ₹{equipmentPrice} / day
      </Text>

      <Text style={styles.label}>
        Start Date
      </Text>

      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => {
          setShowStartPicker(true);
        }}
      >
        <Text style={styles.dateText}>
          {startDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      <Text style={styles.label}>
        End Date
      </Text>

      <TouchableOpacity
        style={styles.dateBox}
        onPress={() => {
          setShowEndPicker(true);
        }}
      >
        <Text style={styles.dateText}>
          {endDate.toDateString()}
        </Text>
      </TouchableOpacity>

      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      <Text style={styles.totalLabel}>
        Total Amount: ₹{totalAmount}
      </Text>

      <TouchableOpacity
        style={styles.button}
        disabled={isBooking}
        onPress={async () => {
          setIsBooking(true);

          try {
            const response = await fetch(
              'http://10.3.11.46:8000/bookings',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  farmer_id: 23,
                  equipment_id: Number(equipmentId),
                  start_date:
                    startDate
                      .toISOString()
                      .split('T')[0],
                  end_date:
                    endDate
                      .toISOString()
                      .split('T')[0],
                  total_amount: totalAmount,
                }),
              }
            );

            const data = await response.json();

            if (response.ok) {
              Alert.alert(
                'Booking Successful',
                `Booking ID: ${data.booking_id}`
              );
            } else {
              Alert.alert(
                'Booking Failed',
                JSON.stringify(data)
              );
            }
          } catch (error) {
            Alert.alert(
              'Connection Error',
              'Could not connect to AgriRent server.'
            );

            console.log(error);
          } finally {
            setIsBooking(false);
          }
        }}
      >
        <Text style={styles.buttonText}>
          {isBooking
            ? 'Booking...'
            : 'Confirm Booking'}
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
    marginBottom: 25,
  },

  equipment: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },

  dateBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
  },

  dateText: {
    fontSize: 16,
  },

  totalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },

  button: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

