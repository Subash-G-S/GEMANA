function FeedbackCard({ fb }) {

  return (

    <div className="border rounded-xl p-4 mb-3">

      <p>
        ⭐ Rating: {fb.rating}
      </p>

      <p>
        💬 Communication:
        {" "}
        {fb.communication}
      </p>

      <p className="mt-2 text-gray-700">
        {fb.review}
      </p>

    </div>

  );
}

export default FeedbackCard;