import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/helpers';
import styles from '../../styles/components/Calendar.module.css';

const Calendar = ({ holidays = [], attendanceData = [], onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentMonth + direction);
    setCurrentDate(newDate);
  };

  const isHoliday = (date) => {
    return holidays.some(holiday => 
      new Date(holiday.date).toDateString() === date.toDateString()
    );
  };

  const getAttendanceStatus = (date) => {
    const attendance = attendanceData.find(record => 
      new Date(record.date).toDateString() === date.toDateString()
    );
    return attendance?.status;
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(clickedDate);
    onDateClick?.(clickedDate);
  };

  const renderCalendarDays = () => {
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className={styles.calendarDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
      const holiday = holidays.find(h => new Date(h.date).toDateString() === date.toDateString());
      const attendanceStatus = getAttendanceStatus(date);

      let dayClass = styles.calendarDay;
      if (isToday) dayClass += ` ${styles.today}`;
      if (isSelected) dayClass += ` ${styles.selected}`;
      if (holiday) dayClass += ` ${styles.holiday}`;
      if (attendanceStatus === 'present') dayClass += ` ${styles.present}`;
      if (attendanceStatus === 'absent') dayClass += ` ${styles.absent}`;

      days.push(
        <div
          key={day}
          className={dayClass}
          onClick={() => handleDateClick(day)}
          title={holiday ? holiday.name : formatDate(date)}
        >
          <span className={styles.dayNumber}>{day}</span>
          {attendanceStatus && (
            <div className={`${styles.attendanceIndicator} ${styles[attendanceStatus]}`} />
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.calendarHeader}>
        <button
          className={styles.navButton}
          onClick={() => navigateMonth(-1)}
        >
          ‹
        </button>
        <h3 className={styles.monthYear}>
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <button
          className={styles.navButton}
          onClick={() => navigateMonth(1)}
        >
          ›
        </button>
      </div>

      <div className={styles.calendarGrid}>
        {dayNames.map(day => (
          <div key={day} className={styles.dayHeader}>
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>

      <div className={styles.calendarLegend}>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.present}`} />
          <span>Present</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.absent}`} />
          <span>Absent</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.legendColor} ${styles.holiday}`} />
          <span>Holiday</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
