function FeedbackCard({ fb }) {

  return (

    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 mb-4">

      <div className="flex justify-between">

        <div>

          <p className="font-bold text-lg">

            ⭐ {fb.rating}/5

          </p>

          <p className="text-sm text-gray-500">

            Communication:
            {" "}
            {fb.communication}/5

          </p>

        </div>

        <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold">

          C

        </div>

      </div>

      <p className="mt-5 text-gray-700 leading-relaxed">

        "{fb.review}"

      </p>

    </div>

  );

}

export default FeedbackCard;