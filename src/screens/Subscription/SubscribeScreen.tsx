import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import colors from '../../constants/colors';

// Example completed days (can come from API/store)
const completedDays = [
  '2025-10-30',
  '2025-10-01',
  '2025-10-02',
  '2025-10-03',
  '2025-10-05',
  '2025-10-06',
];

// Define the date range (start and end dates)
const startDate = '2025-10-01';
const endDate = '2025-10-30';

export default function  MilkCalendar() {
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const marks: any = {};

    // Helper function to get all dates between startDate and endDate
    const getDatesInRange = (start: string, end: string) => {
      const dates: string[] = [];
      let currentDate = new Date(start);
      const endDateObj = new Date(end);
      while (currentDate <= endDateObj) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    // Get all dates in the range
    const dateRange = getDatesInRange(startDate, endDate);

    // Mark each date in the range
    dateRange.forEach((date) => {
      if (completedDays.includes(date)) {
        // Completed days
        marks[date] = {
          startingDay: date === startDate,
          endingDay: date === endDate,
          color: colors.primary || '#4CAF50', // Green for completed days
          textColor: '#ffffff',
        };
      } else {
        // Remaining days
        marks[date] = {
          startingDay: date === startDate,
          endingDay: date === endDate,
          color: colors.accent || '#B0BEC5', // Gray for remaining days
          textColor: '#ffffff',
        };
      }
    });

    setMarkedDates(marks);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milk Supply Calendar</Text>
      <Calendar
        markingType={'period'} // Use period marking for range highlighting
        markedDates={markedDates}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: colors.bg,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
});