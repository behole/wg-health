import React from 'react';

const DailySchedule = ({ appointments = [] }) => {
  // Sort appointments by time
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
  );
  
  // Get today's date in YYYY-MM-DD format for filtering
  const today = new Date().toISOString().split('T')[0];
  
  // Filter to show only today's appointments
  const todaysAppointments = sortedAppointments.filter(apt => apt.date === today);
  
  // Format time to be more readable (e.g., "9:00 AM" instead of "09:00")
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 mb-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Today's Schedule</h2>
      
      {todaysAppointments.length === 0 ? (
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-lg mb-1">No appointments today.</p>
          <p className="text-lg">It's a free day to relax!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {todaysAppointments.map((appointment, index) => (
            <li 
              key={appointment.id || index} 
              className="border-l-4 border-blue-500 pl-3 py-2 flex flex-col"
            >
              {/* Time block */}
              <div className="bg-blue-100 text-blue-800 font-bold rounded-lg p-2 mb-2 inline-block w-auto text-lg">
                {formatTime(appointment.time)}
              </div>
              
              {/* Appointment details */}
              <div>
                <h3 className="text-xl font-bold mb-1">{appointment.title}</h3>
                
                {appointment.location && (
                  <p className="text-lg mb-1">
                    <span className="font-medium">Where:</span> {appointment.location}
                  </p>
                )}
                
                {appointment.withPerson && (
                  <p className="text-lg mb-1">
                    <span className="font-medium">With:</span> {appointment.withPerson}
                  </p>
                )}
                
                {appointment.notes && (
                  <p className="text-lg mt-1 bg-yellow-50 p-2 rounded">
                    {appointment.notes}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      
      <button 
        className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-3 px-4 rounded-lg w-full flex justify-center items-center"
        onClick={() => document.getElementById('add-appointment').scrollIntoView({ behavior: 'smooth' })}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add New Appointment
      </button>
    </div>
  );
};

export default DailySchedule;
