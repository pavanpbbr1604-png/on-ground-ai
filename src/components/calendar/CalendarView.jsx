import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Phone, MapPin, AlertCircle } from 'lucide-react';
import { CALENDAR_EVENTS } from '../../data/calendarData';

export default function CalendarView({ onPlaceCall }) {
  // Current month: October 2026 (index 9)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 10));
  const [selectedDay, setSelectedDay] = useState(10);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 10));
    setSelectedDay(10);
  };

  // Filter events for this month
  const monthEvents = CALENDAR_EVENTS.filter(e => e.year === year && e.month === month);
  const selectedDayEvents = monthEvents.filter(e => e.day === selectedDay);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Calendar Header Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#1a1a1a' }}>
            {monthNames[month]} {year}
          </div>
          <div style={{ fontSize: '12.5px', color: '#8e8e93', marginTop: '2px' }}>
            Scheduled store trials, lead callbacks, and assignment deadlines
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleToday}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '12.5px' }}
          >
            Today (10 Oct)
          </button>

          <button
            onClick={handlePrevMonth}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e5e5ea',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={handleNextMonth}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: '1px solid #e5e5ea',
              background: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1.8fr) minmax(280px, 1.2fr)', gap: '16px' }}>
        
        {/* Month Grid Card */}
        <div className="card" style={{ padding: '16px' }}>
          {/* Day of Week Labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '8px' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} style={{ fontSize: '11px', fontWeight: 700, color: '#8e8e93', textTransform: 'uppercase', padding: '6px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {/* Empty slots before first day */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} style={{ height: '42px' }} />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const hasEvents = monthEvents.some(e => e.day === dayNum);
              const isSelected = selectedDay === dayNum;
              const isToday = dayNum === 10 && month === 9 && year === 2026;

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDay(dayNum)}
                  style={{
                    height: '42px',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    background: isSelected ? '#0f6e56' : isToday ? '#e1f5ee' : '#fff',
                    color: isSelected ? '#fff' : isToday ? '#0f6e56' : '#1a1a1a',
                    fontWeight: isSelected || isToday ? 800 : 500,
                    fontSize: '13px',
                    border: isSelected ? 'none' : isToday ? '1px solid #0f6e56' : '1px solid #f2f2f7',
                    position: 'relative',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span className="tabular">{dayNum}</span>
                  {hasEvents && (
                    <span style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: isSelected ? '#FFD700' : '#1d9e75',
                      marginTop: '2px'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f2f2f7', marginBottom: '12px' }}>
            <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#1a1a1a' }}>
              Schedule for {selectedDay} {monthNames[month]}
            </div>
            <div style={{ fontSize: '12px', color: '#8e8e93', marginTop: '2px' }}>
              {selectedDayEvents.length} event{selectedDayEvents.length === 1 ? '' : 's'} scheduled
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
            {selectedDayEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '36px 16px', color: '#a8a8ad' }}>
                <CalendarIcon size={32} style={{ margin: '0 auto 8px', opacity: 0.3 }} />
                <div style={{ fontSize: '13.5px', fontWeight: 600 }}>No events on this day</div>
                <div style={{ fontSize: '11.5px', marginTop: '2px' }}>Select an highlighted date with a green dot</div>
              </div>
            ) : (
              selectedDayEvents.map(evt => (
                <div
                  key={evt.id}
                  style={{
                    background: '#fbfcfe',
                    border: '1px solid #e3eaf3',
                    borderRadius: '10px',
                    padding: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#185fa5', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} />
                      <span className="tabular">{evt.time}</span>
                    </span>

                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 700,
                      padding: '2px 7px',
                      borderRadius: '10px',
                      background: evt.priority === 'urgent' ? '#fdecec' : '#e1f5ee',
                      color: evt.priority === 'urgent' ? '#e24b4a' : '#0f6e56'
                    }}>
                      {evt.type.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#1a1a1a', lineHeight: 1.4 }}>
                    {evt.title}
                  </div>

                  {evt.client && (
                    <div style={{ fontSize: '12px', color: '#6b6b74', marginTop: '4px' }}>
                      Client: <span style={{ fontWeight: 600 }}>{evt.client}</span> ({evt.phone})
                    </div>
                  )}

                  {evt.notes && (
                    <div style={{ fontSize: '11.5px', color: '#a16207', background: '#fff8e1', padding: '5px 8px', borderRadius: '6px', marginTop: '6px' }}>
                      {evt.notes}
                    </div>
                  )}

                  {evt.phone && (
                    <button
                      onClick={() => onPlaceCall && onPlaceCall({ name: evt.client, phone: evt.phone })}
                      className="btn-primary"
                      style={{ padding: '6px 10px', fontSize: '12px', marginTop: '8px', width: '100%', justifyContent: 'center' }}
                    >
                      <Phone size={12} />
                      <span>Dial Customer</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
