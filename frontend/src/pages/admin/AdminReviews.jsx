import { useQuery } from '@tanstack/react-query';
import { reviewApi } from '@/services/api';
import { Star } from 'lucide-react';

export default function AdminReviews() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => reviewApi.getAll().then(r => r.data),
  });

  return (
    <div className="min-h-screen bg-cream p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-charcoal-800">Reviews Management</h1>
          <p className="text-charcoal-400 text-sm mt-1">{data?.total || 0} total reviews</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">{Array(5).fill(0).map((_, i) => <div key={i} className="bg-white rounded-sm h-24 animate-pulse" />)}</div>
        ) : (data?.reviews || []).length === 0 ? (
          <div className="text-center py-20 text-charcoal-400">
            <Star size={40} className="mx-auto mb-4 opacity-30" />
            <p>No reviews yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(data?.reviews || []).map(review => (
              <div key={review._id} className="bg-white border border-parchment rounded-sm p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-charcoal-800">{review.user?.firstName} {review.user?.lastName}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {Array(5).fill(0).map((_, i) => (
                        <Star key={i} size={13} className={i < review.rating ? 'text-gold-500 fill-gold-500' : 'text-charcoal-200'} />
                      ))}
                    </div>
                  </div>
                  <span className="text-charcoal-400 text-xs">{new Date(review.createdAt).toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-charcoal-500 text-sm mt-3 leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
