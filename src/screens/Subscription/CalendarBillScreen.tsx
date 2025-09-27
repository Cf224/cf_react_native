import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Calendar } from 'react-native-calendars';

export default function CalendarBillScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Example marked dates (replace with real data from subscription deliveries)
  const marked = {
    '2025-09-01': { marked: true, dotColor: '#1976D2' },
    '2025-09-02': { marked: true, dotColor: '#D32F2F' },
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleButtonPressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handleButtonPressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePayNow = () => {
    console.log('Initiating payment for ₹1170');
    // Add payment logic here (e.g., navigate to payment gateway)
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Image
          source={{ uri: 'https://via.placeholder.com/100?text=Milk+Logo' }}
          style={styles.logo}
        />
        <Text style={styles.header}>Delivery Calendar</Text>

        <View style={styles.calendarContainer}>
          <Calendar
            markingType={'simple'}
            markedDates={marked}
            style={styles.calendar}
            theme={{
              calendarBackground: '#F5F6F5',
              textSectionTitleColor: '#0D47A1',
              selectedDayBackgroundColor: '#1976D2',
              selectedDayTextColor: '#fff',
              todayTextColor: '#1976D2',
              dayTextColor: '#263238',
              textDisabledColor: '#90A4AE',
              monthTextColor: '#0D47A1',
              arrowColor: '#1976D2',
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '600',
            }}
          />
        </View>

        <View style={styles.billContainer}>
          <Text style={styles.billTitle}>Monthly Bill</Text>
          <View style={styles.billDetails}>
            <Text style={styles.billText}>Deliveries: <Text style={styles.billValue}>26</Text></Text>
            <Text style={styles.billText}>Price/Delivery: <Text style={styles.billValue}>₹45</Text></Text>
            <Text style={styles.billTotal}>Total: <Text style={styles.billValue}>₹1170</Text></Text>
          </View>

          <TouchableOpacity
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            onPress={handlePayNow}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.payButton, { transform: [{ scale: buttonScale }] }]}>
              <LinearGradient
                colors={['#1976D2', '#2196F3']}
                style={styles.btnGradient}
              >
                <Text style={styles.btnText}>Pay Now</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    paddingBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 12,
    borderRadius: 40,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 16,
  },
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  billContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  billTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D47A1',
    marginBottom: 12,
  },
  billDetails: {
    marginBottom: 16,
  },
  billText: {
    fontSize: 16,
    color: '#546E7A',
    marginBottom: 8,
  },
  billValue: {
    fontWeight: '600',
    color: '#263238',
  },
  billTotal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1',
    marginTop: 8,
  },
  payButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  btnGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});