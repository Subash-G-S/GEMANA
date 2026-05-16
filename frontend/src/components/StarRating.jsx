function StarRating({ rating, setRating }) {

  return (

    <div className="flex gap-2 text-3xl">

      {[1, 2, 3, 4, 5].map((star) => (

        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={
            star <= rating
              ? "text-yellow-400"
              : "text-gray-300"
          }
        >
          ★
        </button>

      ))}

    </div>

  );
}

export default StarRating;