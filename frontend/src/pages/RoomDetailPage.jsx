import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { roomApi } from '@/services/api';
import { useBookingStore } from '@/store/authStore';
import { Users, Star, Maximize2, Wind, CheckCircle2 } from 'lucide-react';

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const setSelectedRoom = useBookingStore(function(s) { return s.setSelectedRoom; });
  const setStep = useBookingStore(function(s) { return s.setStep; });

  const { data, isLoading } = useQuery({
    queryKey: ['room', id],
    queryFn: function() { return roomApi.getOne(id).then(function(r) { return r.data.room; }); },
    enabled: !!id,
  });

  if (isLoading) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-gold-500/30 border-t-gold-500 rounded-full animate-spin" />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="text-center">
        <p className="text-charcoal-400 mb-4">Room not found.</p>
        <button onClick={function() { navigate('/rooms'); }} className="btn-gold text-sm">← Back to Rooms</button>
      </div>
    </div>
  );

  var room = data;
  var images = room.images && room.images.length > 0 ? room.images : [
    { url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80' },
  ];

  var handleBook = function() {
    setSelectedRoom(room);
    setStep(1);
    navigate('/booking?roomId=' + room._id);
  };

  return (
    <div className="min-h-screen bg-cream pt-16 pb-16">
      <div className="relative h-[55vh] overflow-hidden">
        <img src={images[0].url} alt={room.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <p className="text-gold-400 text-xs uppercase tracking-widest mb-1">{room.type}</p>
          <h1 className="font-display text-4xl font-bold">{room.name}</h1>
          {room.ratings?.count > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Star size={14} className="text-gold-400 fill-gold-400" />
              <span className="text-white text-sm">{room.ratings.average} ({room.ratings.count} reviews)</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-2xl text-charcoal-800 mb-3">About This Room</h2>
              <p className="text-charcoal-500 leading-relaxed">{room.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                [Users, room.capacity?.adults + ' Adults'],
                [Maximize2, room.size + ' sq.ft'],
                [Wind, room.bedType?.replace('-', ' ')],
                [CheckCircle2, room.acType?.toUpperCase()],
              ].map(function(item, i) {
                var Icon = item[0];
                return (
                  <div key={i} className="bg-white border border-parchment rounded-sm p-3 text-center">
                    <Icon size={20} className="text-gold-500 mx-auto mb-1" />
                    <p className="text-charcoal-700 text-xs font-medium">{item[1]}</p>
                  </div>
                );
              })}
            </div>

            {room.amenities && room.amenities.length > 0 && (
              <div>
                <h3 className="font-display text-xl text-charcoal-800 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {room.amenities.map(function(a, i) {
                    return (
                      <div key={i} className="flex items-center gap-2 text-sm text-charcoal-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                        {a.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {images.length > 1 && (
              <div>
                <h3 className="font-display text-xl text-charcoal-800 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 gap-3">
                  {images.slice(1).map(function(img, i) {
                    return <img key={i} src={img.url} alt={img.alt || room.name} className="rounded-sm object-cover h-40 w-full" />;
                  })}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white border border-parchment rounded-sm shadow-luxury p-6 sticky top-24">
              <div className="text-charcoal-400 text-xs uppercase tracking-widest mb-1">Starting from</div>
              <div className="font-display text-3xl font-bold text-charcoal-800 mb-1">
                ₹{room.price?.base?.toLocaleString('en-IN')}
              </div>
              <div className="text-charcoal-400 text-xs mb-1">per night + taxes</div>
              {room.price?.weekend && (
                <div className="text-charcoal-400 text-xs mb-4">₹{room.price.weekend.toLocaleString('en-IN')}/night on weekends</div>
              )}
              <button onClick={handleBook} className="btn-gold w-full">Book This Room</button>
              <p className="text-charcoal-400 text-xs text-center mt-3">Free cancellation up to 24 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
