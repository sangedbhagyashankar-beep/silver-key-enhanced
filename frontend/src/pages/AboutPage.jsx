export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-charcoal-900 py-20 text-center">
        <p className="text-gold-500 text-xs uppercase tracking-[0.3em] mb-3">Our Story</p>
        <h1 className="font-display text-5xl text-white font-bold">About Silver Key</h1>
        <div className="w-16 h-0.5 bg-gold-500 mx-auto mt-4" />
      </div>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl text-charcoal-800 mb-4">A Legacy of Luxury</h2>
            <p className="text-charcoal-500 leading-relaxed mb-4">Silver Key Hotel was founded with a singular vision: to create a sanctuary where world-class hospitality meets timeless elegance. Nestled in the heart of Bengaluru, we have welcomed guests from across India and around the globe.</p>
            <p className="text-charcoal-500 leading-relaxed">Every detail — from our hand-selected furnishings to our signature cuisine — is curated to offer an experience that transcends the ordinary.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80" alt="Hotel" className="rounded-sm shadow-luxury" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[['50+', 'Luxury Rooms'], ['10+', 'Years of Service'], ['10,000+', 'Happy Guests']].map(([num, label]) => (
            <div key={label} className="bg-white border border-parchment rounded-sm p-8 shadow-sm">
              <div className="font-display text-4xl text-gold-500 font-bold mb-2">{num}</div>
              <div className="text-charcoal-500 text-sm uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
