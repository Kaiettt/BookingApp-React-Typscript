interface Props {
    reviews: Review[]
    avgRating: number | null
    totalRating: number | null
}

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
)

export default function PropertyReviews({ reviews, avgRating, totalRating }: Props) {
    return (
        <section className="space-y-6">
            {/* Header / Average rating */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <h2 className="text-2xl font-bold">Guest Reviews</h2>

                {avgRating !== null && totalRating !== null && (
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1">
                                <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
                                <StarRating rating={Math.round(avgRating)} />
                            </div>
                            <div className="text-sm text-gray-500">{totalRating} reviews</div>
                        </div>
                    </div>
                )}
            </div>

            {/* Reviews */}
            {!reviews.length ? (
                <p className="text-gray-500 py-4">No reviews yet</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="p-4 border rounded-xl shadow-sm bg-white"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-800">{review.userName}</h3>
                                    <StarRating rating={review.rating} />
                                </div>
                                {review.createdAt && (
                                    <span className="text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                )}
                            </div>
                            <p className="mt-2 text-gray-700">{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
