import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import StarRating from "../components/StarRating";

function FeedbackPage() {

  const { feedbackId } = useParams();

  const [project, setProject] = useState(null);

  const [loading, setLoading] = useState(true);

  const [submitted, setSubmitted] = useState(false);

  const [rating, setRating] = useState(0);

  const [communication, setCommunication] =
    useState(0);

  const [delivery, setDelivery] = useState(0);

  const [professionalism, setProfessionalism] =
    useState(0);

  const [review, setReview] = useState("");

  useEffect(() => {
    fetchProject();
  }, []);

  const fetchProject = async () => {

    try {

      const q = query(
        collection(db, "projects"),
        where("feedbackId", "==", feedbackId)
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {

        setProject({
          id: doc.id,
          ...doc.data(),
        });

      });

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (
      !rating ||
      !communication ||
      !delivery ||
      !professionalism
    ) {
      return alert(
        "Please complete all ratings"
      );
    }

    try {

      await addDoc(
        collection(db, "feedbacks"),
        {
          projectId: project.id,
          feedbackId,

          rating,
          communication,
          delivery,
          professionalism,

          review,

          createdAt: new Date(),
        }
      );

      setSubmitted(true);

    } catch (error) {

      alert(error.message);

    }
  };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-black text-white text-2xl">
        Loading...
      </div>

    );
  }

  if (!project) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Project not found
      </div>

    );
  }

  if (submitted) {

    return (

      <div className="min-h-screen bg-black flex items-center justify-center p-6">

        <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center">

          <div className="text-6xl mb-4">
            🎉
          </div>

          <h1 className="text-3xl font-bold">
            Feedback Submitted
          </h1>

          <p className="text-gray-500 mt-4">
            Thank you for sharing your
            experience.
          </p>

        </div>

      </div>

    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-6">

      <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden">

        {/* Top Section */}

        <div className="bg-black text-white p-8">

          <p className="uppercase text-sm tracking-[4px] text-gray-400">
            GEMANA
          </p>

          <h1 className="text-4xl font-bold mt-3">
            Client Feedback
          </h1>

          <p className="text-gray-400 mt-4">
            Help freelancers improve their
            services through honest feedback.
          </p>

        </div>

        {/* Content */}

        <div className="p-8">

          {/* Project Info */}

          <div className="bg-gray-100 rounded-2xl p-5 mb-8">

            <p className="text-sm text-gray-500">
              Project
            </p>

            <h2 className="text-2xl font-bold mt-1">
              {project.projectName}
            </h2>

            <p className="text-gray-600 mt-2">
              Client: {project.clientName}
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-8"
          >

            {/* Overall Rating */}

            <div>

              <p className="text-lg font-semibold mb-3">
                Overall Experience
              </p>

              <StarRating
                rating={rating}
                setRating={setRating}
              />

            </div>

            {/* Communication */}

            <div>

              <p className="text-lg font-semibold mb-3">
                Communication
              </p>

              <StarRating
                rating={communication}
                setRating={setCommunication}
              />

            </div>

            {/* Delivery */}

            <div>

              <p className="text-lg font-semibold mb-3">
                Delivery Speed
              </p>

              <StarRating
                rating={delivery}
                setRating={setDelivery}
              />

            </div>

            {/* Professionalism */}

            <div>

              <p className="text-lg font-semibold mb-3">
                Professionalism
              </p>

              <StarRating
                rating={professionalism}
                setRating={
                  setProfessionalism
                }
              />

            </div>

            {/* Review */}

            <div>

              <p className="text-lg font-semibold mb-3">
                Detailed Feedback
              </p>

              <textarea
                placeholder="Share your experience working with this freelancer..."
                value={review}
                onChange={(e) =>
                  setReview(e.target.value)
                }
                rows="6"
                className="w-full border border-gray-300 rounded-2xl p-5 outline-none focus:border-black resize-none"
              />

            </div>

            {/* Submit */}

            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:scale-[1.01] transition-all"
            >
              Submit Feedback
            </button>

          </form>

        </div>

      </div>

    </div>

  );
}

export default FeedbackPage;