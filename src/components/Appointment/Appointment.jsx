import React from 'react';
import AppointmentSection from './AppointmentSection';
import CtaSection from './CtaSection';

function Appointment() {
  return (
    <div className="bg-[#F5F5F5] overflow-x-hidden">
      <main>
        <AppointmentSection />
        <CtaSection />
      </main>
    </div>
  );
}

export default Appointment;
