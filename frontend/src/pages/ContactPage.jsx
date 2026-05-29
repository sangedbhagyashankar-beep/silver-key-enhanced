import { useState } from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Message sent! We will get back to you shortly.');
      setForm({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <p className="text-gold-600 text-xs uppercase tracking-[0.3em] mb-2">Get in Touch</p>
          <h1 className="font-display text-4xl text-charcoal-800">Contact Us</h1>
          <div className="w-12 h-0.5 bg-gold-500 mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="space-y-6">
            {[
              { icon: MapPin, title: 'Address', text: 'Electronic City Post, Hebbagodi, Bengaluru — 560135' },
              { icon: Phone, title: 'Phone', text: '+91 93228 00100' },
              { icon: Mail, title: 'Email', text: 'reservations@silverkey.com' },
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 bg-gold-50 rounded-sm flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gold-500" />
                </div>
                <div><div className="font-bold text-charcoal-700 text-sm">{title}</div><div className="text-charcoal-500 text-sm mt-0.5">{text}</div></div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2 bg-white border border-parchment rounded-sm shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Name</label>
                  <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="input-luxury" placeholder="Your name" required />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-luxury" placeholder="your@email.com" required />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Subject</label>
                <input value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="input-luxury" placeholder="How can we help?" required />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-charcoal-500 block mb-2">Message</label>
                <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={5} className="input-luxury resize-none" placeholder="Your message..." required />
              </div>
              <button type="submit" disabled={loading} className="btn-gold w-full">
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
