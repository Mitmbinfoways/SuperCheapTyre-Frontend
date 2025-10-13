import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CloudCog } from 'lucide-react';
import { toast } from 'react-toastify';
import { getTimeslot, getGetHolidays, getAppointmentSlots } from '../../axios/axios';
import Loader from '../common/Loader';
import { loadStripe } from '@stripe/stripe-js';
import { secureGetItem, secureSetItem } from '../../Utils/encryption';

const Calendar = ({ selectedDate, setSelectedDate, showError, holidays = [] }) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day) => {
    if (day) {
      const clickedDate = new Date(currentYear, currentMonth, day);
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      // Only allow future dates
      if (clickedDate >= todayDate) {
        setSelectedDate(clickedDate);
      }
    }
  };

  const isDateSelected = (day) => {
    if (!day || !selectedDate) return false;
    return selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear;
  };

  const isDateDisabled = (day) => {
    if (!day) return true;
    const date = new Date(currentYear, currentMonth, day);
    const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Check if date is in the past
    if (date < todayDate) return true;

    // Check if date is a holiday
    const isHoliday = holidays.some(holiday => {
      // Create date from holiday string and compare with calendar date
      const holidayDate = new Date(holiday.date);
      return holidayDate.getFullYear() === currentYear &&
        holidayDate.getMonth() === currentMonth &&
        holidayDate.getDate() === day;
    });

    return isHoliday;
  };

  const isHolidayDate = (day) => {
    if (!day) return false;
    return holidays.some(holiday => {
      // Create date from holiday string and compare with calendar date
      const holidayDate = new Date(holiday.date);
      return holidayDate.getFullYear() === currentYear &&
        holidayDate.getMonth() === currentMonth &&
        holidayDate.getDate() === day;
    });
  };

  return (
    <div>
      <div className="bg-white p-6 rounded-2xl shadow-calendar shadow-[8px_3px_22px_10px_#9696961C] w-full max-w-80">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft size={20} className="text-icon-gray" />
          </button>
          <h3 className="font-sf-pro font-medium text-brand-blue uppercase tracking-wider">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <ChevronRight size={20} className="text-icon-gray" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-2 text-center mb-4">
          {days.map(day => <div key={day} className="font-sf-pro text-xs text-icon-gray">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2 text-center">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={isDateDisabled(day)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-sf-pro
              ${!day ? 'invisible' : ''}
              ${isDateSelected(day) ? 'bg-[#1F95AF] text-white' : ''}
              ${isDateDisabled(day) && !isHolidayDate(day) ? 'text-gray-300 cursor-not-allowed' : ''}
              ${isHolidayDate(day) ? 'bg-red-100 text-red-600 cursor-not-allowed border border-red-300' : ''}
              ${!isDateDisabled(day) && !isHolidayDate(day) ? 'text-black hover:bg-gray-100 hover:text-black' : ''}
            `}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      {showError && (
        <p className="text-xs text-[#FF0000] mt-3">Please select a date.</p>
      )}
      <p className="text-xs sm:text-sm text-[#7A7A7A] mt-3 text-nowrap sm:mt-5 text-center sm:text-left">Appointments can be booked for 45 minutes only.</p>
    </div>
  );
};

const TimePicker = ({ selectedTime, setSelectedTime, showError, slots, loading }) => {
  // Show toast when error is displayed
  useEffect(() => {
    if (showError) {
      toast.error("Please select a time slot.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [showError]);

  const handleTimeSelect = (slot) => {
    if (slot.isAvailable !== false) {
      setSelectedTime(slot.label);
      // Store the selected slot ID in localStorage
      localStorage.setItem('selectedSlotId', slot.slotId);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {loading ? (
        <div className="col-span-1 sm:col-span-2 text-center text-sm text-[#7A7A7A]">Loading time slots...</div>
      ) : (slots && slots.length > 0 ? (
        slots.map((slot) => {
          const isSelected = slot.label === selectedTime;
          const isUnavailable = slot.isAvailable === false;
          return (
            <button
              key={slot.label}
              onClick={() => handleTimeSelect(slot)}
              disabled={isUnavailable}
              className={`p-3 text-xs sm:text-sm rounded-md border border-[#7E7E7E] text-center transition-colors w-full min-h-[48px] flex items-center justify-center
                ${isUnavailable ? 'bg-[#D7D7D7] text-[#7A7A7A] cursor-not-allowed' : (isSelected ? 'bg-[#ED1C24] text-white border-brand-red' : 'bg-white hover:bg-[#D7D7D7]')}
              `}
            >
              <span className="whitespace-nowrap">{slot.label}</span>
            </button>
          );
        })
      ) : (
        <div className="col-span-1 sm:col-span-2 text-center text-sm text-[#7A7A7A]">No time slots available.</div>
      ))}
      {showError && (
        <div className="col-span-1 sm:col-span-2">
          <p className="text-xs text-[#FF0000] mt-1">Please select a time slot.</p>
        </div>
      )}
    </div>
  );
};

const BookingForm = ({ selectedDate, selectedTime, onSubmitAttempt }) => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [remarks, setRemarks] = useState('');
  const [touched, setTouched] = useState({});

  const formatAppointmentDate = (date) => {
    if (!date) return '';
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  // New function to format date for backend (ISO format)
  const formatAppointmentDateForBackend = (date) => {
    if (!date) return '';
    // Return date in YYYY-MM-DD format for backend, preserving local date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const appointmentString = selectedDate && selectedTime ?
    `${formatAppointmentDate(selectedDate)} at ${selectedTime}` :
    'No appointment selected';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9+()\-\s]{7,}$/;

  const errors = {
    firstName: firstName.trim() === '' ? 'First name is required' : '',
    lastName: lastName.trim() === '' ? 'Last name is required' : '',
    email: email.trim() === '' ? 'Email is required' : (!emailRegex.test(email) ? 'Enter a valid email' : ''),
    phone: phone.trim() === '' ? 'Phone is required' : (!phoneRegex.test(phone) ? 'Enter a valid phone' : ''),
    remarks: remarks.trim() === '' ? 'Remarks are required' : ''
  };

  const hasFieldErrors = Object.values(errors).some(Boolean);
  const isFormReady = !!selectedDate && !!selectedTime && !hasFieldErrors;

  const markAllTouched = () => setTouched({ firstName: true, lastName: true, email: true, phone: true, remarks: true });

  const makePayment = async (payload) => {
    try {
      // Get cart items from localStorage
      const cart = secureGetItem('cartItems', []);

      if (!cart.length) {
        toast.error('Please add at least one tyre to cart');
        navigate('/tyres');
        return;
      }

      // Store appointment data in localStorage for use after payment
      const appointmentData = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phone: payload.phone,
        remarks: payload.remarks,
        date: payload.appointment.date, // This is now in ISO format (YYYY-MM-DD)
        time: payload.appointment.time
      };

      secureSetItem('appointmentData', appointmentData);
      // Store cart items for use after payment
      secureSetItem('cartItemsForOrder', cart);

      // Transform cart data to match expected format
      const transformedCart = cart.map(item => ({
        name: item.name || item.title || 'Tyre Product',
        price: item.price ? parseFloat(item.price) : 0,
        quantity: item.quantity || 1,
      }));

      const body = { Product: transformedCart };

      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment session');
      }

      const session = await response.json();

      // ✅ New Stripe redirect method
      if (session.url) {
        window.location.href = session.url; // Redirect user to Stripe Checkout
      } else {
        throw new Error('Invalid session URL received from server');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment initialization failed. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    markAllTouched();
    if (onSubmitAttempt) {
      onSubmitAttempt(true);
    }
    if (!selectedDate || !selectedTime) {
      return;
    }
    if (hasFieldErrors) {
      return;
    }

    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      remarks: remarks.trim(),
      appointment: {
        date: formatAppointmentDateForBackend(selectedDate), // Use ISO format for backend
        time: selectedTime
      }
    };

    // Make payment with the payload
    await makePayment(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#FEFEFF] p-6 rounded-2xl shadow-card shadow-[0_4px_4px_0_#00000040] w-full">
      <h3 className="flex items-center justify-center text-xl font-medium mb-4">Your Details</h3>
      <div className="space-y-3">
        <div className="bg-[#F4F4F4] border border-[#7E7E7E] rounded-lg p-4">
          <p className="text-xs text-[#FF0000] leading-relaxed tracking-wide">
            <span className="text-[#FF0000]">Selected Appointment:</span><br />
            {appointmentString}
          </p>
        </div>

        <div>
          <label className="text-base font-normal mb-2 block">First Name</label>
          <input
            type="text"
            placeholder="Enter your First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
            className={`w-full p-2 placeholder:text-[#6F6F6F] text-sm border border-[#7E7E7E] rounded-lg bg-transparent focus:outline-none focus:ring-1 ${errors.firstName && touched.firstName ? 'border-[#FF0000] focus:ring-[#FF0000]' : 'border-border-gray focus:ring-brand-red'}`}
          />
          {errors.firstName && touched.firstName && (
            <p className="mt-1 text-xs text-[#FF0000]">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="text-base font-normal mb-2 block">Last Name</label>
          <input
            type="text"
            placeholder="Enter your Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
            className={`w-full p-2 placeholder:text-[#6F6F6F] text-sm border border-[#7E7E7E] rounded-lg bg-transparent focus:outline-none focus:ring-1 ${errors.lastName && touched.lastName ? 'border-[#FF0000] focus:ring-[#FF0000]' : 'border-border-gray focus:ring-brand-red'}`}
          />
          {errors.lastName && touched.lastName && (
            <p className="mt-1 text-xs text-[#FF0000]">{errors.lastName}</p>
          )}
        </div>

        <div>
          <label className="text-base font-normal mb-2 block">Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            className={`w-full p-2 placeholder:text-[#6F6F6F] text-sm border border-[#7E7E7E] rounded-lg bg-transparent focus:outline-none focus:ring-1 ${errors.email && touched.email ? 'border-[#FF0000] focus:ring-[#FF0000]' : 'border-border-gray focus:ring-brand-red'}`}
          />
          {errors.email && touched.email && (
            <p className="mt-1 text-xs text-[#FF0000]">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="text-base font-normal mb-2 block">Phone No.</label>
          <input
            type="tel"
            placeholder="Enter your Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
            className={`w-full p-2 placeholder:text-[#6F6F6F] border text-sm border-[#7E7E7E] rounded-lg bg-transparent focus:outline-none focus:ring-1 ${errors.phone && touched.phone ? 'border-[#FF0000] focus:ring-[#FF0000]' : 'border-border-gray focus:ring-brand-red'}`}
          />
          {errors.phone && touched.phone && (
            <p className="mt-1 text-xs text-[#FF0000]">{errors.phone}</p>
          )}
        </div>

        <div>
          <label className="text-base font-normal mb-2 block">Remarks</label>
          <textarea
            placeholder="Enter your appointment details here."
            rows="4"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, remarks: true }))}
            className={`w-full p-2 placeholder:text-[#6F6F6F] text-sm border border-[#7E7E7E] rounded-lg bg-transparent focus:outline-none focus:ring-1 ${errors.remarks && touched.remarks ? 'border-[#FF0000] focus:ring-[#FF0000]' : 'border-border-gray focus:ring-brand-red'}`}
          ></textarea>
          {errors.remarks && touched.remarks && (
            <p className="mt-1 text-xs text-[#FF0000]">{errors.remarks}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full text-white font-semibold py-2.5 rounded-lg transition-colors ${isFormReady ? 'bg-[#ED1C24] hover:bg-opacity-90' : 'bg-[#ED1C24]'}`}
        >
          Confirm Booking & Proceed to Payment
        </button>
      </div>
    </form>
  );
};

const AppointmentSection = () => {
  const [selectedDate, setSelectedDate] = useState(new Date()); // Set today as default
  const [selectedTime, setSelectedTime] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [loadingHolidays, setLoadingHolidays] = useState(false);
  const [timeSlotId, setTimeSlotId] = useState(null);

  const formatTo12Hour = (time24) => {
    // time24 in format "HH:MM"
    const [hh, mm] = time24.split(':').map(Number);
    const period = hh >= 12 ? 'PM' : 'AM';
    const hour12 = ((hh + 11) % 12) + 1;
    return `${hour12}:${String(mm).padStart(2, '0')} ${period}`;
  };

  // Fetch timeSlotId from timeslot API
  const fetchTimeSlotId = async () => {
    try {
      const res = await getTimeslot();
      const timeSlotData = res?.data?.data?.[0];
      if (timeSlotData && timeSlotData._id) {
        setTimeSlotId(timeSlotData._id);
        // Store timeSlotId in localStorage
        localStorage.setItem('timeSlotId', timeSlotData._id);
      }
    } catch (error) {
      console.error('Error fetching timeSlotId:', error);
    }
  };

  // Fetch slots for selected date
  const fetchSlotsForDate = async (date) => {
    if (!date || !timeSlotId) return;

    try {
      setLoadingSlots(true);
      setSelectedTime(null); // Reset selected time when date changes

      // Format date as YYYY-MM-DD, preserving local date
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      const res = await getAppointmentSlots(dateString, timeSlotId);
      console.log(res.data.data);
      const slotsData = res?.data?.data?.slots || [];

      // Map all slots including unavailable ones with label and isAvailable
      const allSlots = slotsData.map(slot => ({
        label: `${formatTo12Hour(slot.startTime)} - ${formatTo12Hour(slot.endTime)}`,
        isAvailable: !!slot.isAvailable,
        slotId: slot.slotId // Store slotId for appointment creation
      }));

      setSlots(allSlots);
    } catch (error) {
      console.error('Error fetching slots for date:', error);
      setSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        setLoadingHolidays(true);
        const res = await getGetHolidays();
        const holidayItems = res?.data?.data?.items || [];
        setHolidays(holidayItems);
        // Auto-select today unless it's a holiday; if holiday, pick next non-holiday
        const today = new Date();
        const isHoliday = (d) => {
          return holidayItems.some(h => {
            const hd = new Date(h.date);
            return hd.getFullYear() === d.getFullYear() && hd.getMonth() === d.getMonth() && hd.getDate() === d.getDate();
          });
        };
        let candidate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let safety = 0;
        while (isHoliday(candidate) && safety < 370) {
          candidate.setDate(candidate.getDate() + 1);
          safety += 1;
        }
        setSelectedDate(candidate);
      } catch (error) {
        console.error('Error fetching holidays:', error);
        setHolidays([]);
      } finally {
        setLoadingHolidays(false);
      }
    };

    fetchHolidays();
    fetchTimeSlotId(); // Fetch timeSlotId on component mount
  }, []);

  // Fetch slots when selectedDate or timeSlotId changes
  useEffect(() => {
    if (selectedDate && timeSlotId) {
      fetchSlotsForDate(selectedDate);
    }
  }, [selectedDate, timeSlotId]);

  return (
    <section className="py-10 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-medium text-[#ED1C24] mb-2">Book Your Appointment</h1>
        <p className="text-xl text-[#7A7A7A]">Choose your preferred date and time, then provide your details to confirm</p>
      </div>

      <div className="max-w-screen-2xl mx-auto grid lg:grid-cols-10 gap-5 items-start">
        {/* Left Column */}
        <div className="bg-[#FDFDFE] p-8 rounded-2xl shadow-card shadow-[0_4px_4px_0_#00000040] lg:col-span-6">
          <h3 className="text-2xl font-medium mb-7">Choose a Date & Time</h3>
          <div className="grid md:grid-cols-2 items-start">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              showError={submitAttempted && !selectedDate}
              holidays={holidays}
            />
            {loadingHolidays ? (
              <div className="grid place-items-center h-full min-h-[240px]"><Loader label="Loading holidays..." /></div>
            ) : selectedDate ? (
              <TimePicker
                selectedTime={selectedTime}
                setSelectedTime={setSelectedTime}
                showError={submitAttempted && !selectedTime}
                slots={slots}
                loading={loadingSlots}
              />
            ) : (
              <div className="grid place-items-center h-full min-h-[240px]">
                <p className="text-sm text-[#7A7A7A]">Please select a date to choose a time slot.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 lg:max-w-2xl">
          <BookingForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSubmitAttempt={() => setSubmitAttempted(true)}
          />
        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;
