
/*
PROTECTED CUSTOMER BOOKING DETAILS


import React, { useState } from 'react';
import { Ticket, Calendar, MapPin, Download, Mail, Share2, Search, Filter, Check, Clock, X, AlertCircle, ChevronRight, QrCode, RefreshCw } from 'lucide-react';

// Customer Portal - Booking History
const CustomerPortal = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Mock bookings data
  const mockBookings = [
    {
      id: '1',
      bookingReference: 'AFM-2024-ABC123',
      event: {
        title: 'Summer Music Festival',
        date: '2025-12-15',
        time: '7:00 PM',
        location: 'Lagos Arena, Nigeria',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
      },
      ticketType: 'VIP',
      quantity: 2,
      totalAmount: 30000,
      paymentStatus: 'completed',
      bookingDate: '2024-10-20T10:30:00Z',
      qrCode: 'AFM-2024-ABC123-QR',
    },
    {
      id: '2',
      bookingReference: 'AFM-2024-XYZ789',
      event: {
        title: 'Afrobeat Night',
        date: '2025-11-20',
        time: '8:00 PM',
        location: 'Freedom Park, Accra',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400',
      },
      ticketType: 'General Admission',
      quantity: 1,
      totalAmount: 5000,
      paymentStatus: 'completed',
      bookingDate: '2024-10-18T14:20:00Z',
      qrCode: 'AFM-2024-XYZ789-QR',
    },
    {
      id: '3',
      bookingReference: 'AFM-2024-DEF456',
      event: {
        title: 'Jazz Evening',
        date: '2024-09-15',
        time: '7:30 PM',
        location: 'The Groove, Nairobi',
        image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400',
      },
      ticketType: 'VVIP',
      quantity: 2,
      totalAmount: 50000,
      paymentStatus: 'completed',
      bookingDate: '2024-08-20T09:15:00Z',
      qrCode: 'AFM-2024-DEF456-QR',
    },
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: 2 },
    { id: 'past', label: 'Past Events', count: 1 },
    { id: 'all', label: 'All Bookings', count: 3 },
  ];

  const filteredBookings = mockBookings.filter(booking => {
    const eventDate = new Date(booking.event.date);
    const now = new Date();
    const matchesSearch = booking.event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'upcoming') return eventDate > now;
    if (activeTab === 'past') return eventDate <= now;
    return true;
  });

  const getStatusIcon = (status) => {
    if (status === 'completed') return <Check className="w-5 h-5 text-green-500" />;
    if (status === 'pending') return <Clock className="w-5 h-5 text-yellow-500" />;
    return <X className="w-5 h-5 text-red-500" />;
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return 'text-green-500 bg-green-500/10 border-green-500';
    if (status === 'pending') return 'text-yellow-500 bg-yellow-500/10 border-yellow-500';
    return 'text-red-500 bg-red-500/10 border-red-500';
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header *}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">My Bookings</h1>
          <p className="text-gray-400">Manage your event tickets and booking history</p>
        </div>

        {/* Search and Filters *}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <button className="px-6 py-3 bg-gray-900 text-white rounded-lg border border-gray-800 hover:border-orange-500 transition-colors flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </button>
        </div>

        {/* Tabs *}
        <div className="flex gap-4 mb-8 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-semibold transition-colors relative ${
                activeTab === tab.id
                  ? 'text-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-orange-500/20 text-orange-500'
                  : 'bg-gray-800 text-gray-400'
              }`}>
                {tab.count}
              </span>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
              )}
            </button>
          ))}
        </div>

        {/* Bookings Grid *}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Start booking amazing events today!'}
            </p>
            <a
              href="/events"
              className="inline-block px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Browse Events
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-orange-500 transition-all cursor-pointer group"
              >
                <div className="flex">
                  <div className="w-1/3">
                    <img 
                      src={booking.event.image}
                      alt={booking.event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-orange-500 transition-colors">
                          {booking.event.title}
                        </h3>
                        <p className="text-sm text-gray-400 font-mono">{booking.bookingReference}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full border flex items-center gap-1 text-xs ${getStatusColor(booking.paymentStatus)}`}>
                        {getStatusIcon(booking.paymentStatus)}
                        <span className="capitalize">{booking.paymentStatus}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(booking.event.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</span>
                        <span>• {booking.event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{booking.event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4" />
                        <span>{booking.quantity}x {booking.ticketType}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <span className="text-xl font-bold text-white">
                        ₦{booking.totalAmount.toLocaleString()}
                      </span>
                      <button className="text-orange-500 hover:text-orange-400 font-semibold flex items-center gap-1">
                        View Details
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal *}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header *}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Booking Details</h2>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content *}
            <div className="p-6 space-y-6">
              {/* Status Banner *}
              <div className={`p-4 rounded-lg border flex items-center gap-3 ${getStatusColor(selectedBooking.paymentStatus)}`}>
                {getStatusIcon(selectedBooking.paymentStatus)}
                <div>
                  <h3 className="font-semibold">
                    {selectedBooking.paymentStatus === 'completed' && 'Booking Confirmed'}
                    {selectedBooking.paymentStatus === 'pending' && 'Payment Pending'}
                    {selectedBooking.paymentStatus === 'failed' && 'Payment Failed'}
                  </h3>
                  <p className="text-sm opacity-80">
                    {selectedBooking.paymentStatus === 'completed' && 'Your tickets are ready'}
                    {selectedBooking.paymentStatus === 'pending' && 'Awaiting payment confirmation'}
                    {selectedBooking.paymentStatus === 'failed' && 'Please try booking again'}
                  </p>
                </div>
              </div>

              {/* Event Info *}
              <div className="bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  src={selectedBooking.event.image}
                  alt={selectedBooking.event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-white mb-2">{selectedBooking.event.title}</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedBooking.event.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{selectedBooking.event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedBooking.event.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details *}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Booking Reference</p>
                  <p className="text-white font-mono font-semibold">{selectedBooking.bookingReference}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Booking Date</p>
                  <p className="text-white font-semibold">
                    {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Ticket Type</p>
                  <p className="text-white font-semibold">{selectedBooking.ticketType}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-1">Quantity</p>
                  <p className="text-white font-semibold">{selectedBooking.quantity} ticket(s)</p>
                </div>
              </div>

              {/* Total Amount *}
              <div className="bg-orange-500/10 border border-orange-500 rounded-lg p-4 flex items-center justify-between">
                <span className="text-orange-500 font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-orange-500">
                  ₦{selectedBooking.totalAmount.toLocaleString()}
                </span>
              </div>

              {/* QR Code *}
              {selectedBooking.paymentStatus === 'completed' && (
                <div className="bg-gray-800 rounded-lg p-6 text-center">
                  <p className="text-gray-400 text-sm mb-4">Show this QR code at the venue entrance</p>
                  <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-900" />
                    {/* Actual QR code would be generated here *}
                  </div>
                  <p className="text-gray-500 text-xs mt-4 font-mono">{selectedBooking.qrCode}</p>
                </div>
              )}

              {/* Action Buttons *}
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedBooking.paymentStatus === 'completed' && (
                  <>
                    <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                      <Download className="w-5 h-5" />
                      Download Ticket
                    </button>
                    <button className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                      <Mail className="w-5 h-5" />
                      Email Ticket
                    </button>
                    <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </>
                )}
                {selectedBooking.paymentStatus === 'pending' && (
                  <button className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Complete Payment
                  </button>
                )}
              </div>

              {/* Help Text *}
              <p className="text-center text-gray-500 text-sm">
                Need help? Contact us at <a href="mailto:support@afromerica.com" className="text-orange-500 hover:text-orange-400">support@afromerica.com</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPortal;


*/