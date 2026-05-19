import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";

import StatsCard from "../components/StatsCard";
import AnalyticsCharts from "../components/AnalyticsCharts";
import FeedbackCard from "../components/FeedbackCard";

function PublicProfile() {

  const { username } = useParams();

  const [userData, setUserData] =
    useState(null);

  const [projects, setProjects] =
    useState([]);

  const [feedbacks, setFeedbacks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    fetchProfile();

  }, []);

  const fetchProfile = async () => {

    try {

      /* Find User */

      const userQuery = query(
        collection(db, "users"),
        where(
          "username",
          "==",
          username
        )
      );

      const userSnapshot =
        await getDocs(userQuery);

      let foundUser = null;

      userSnapshot.forEach((doc) => {

        foundUser = {
          id: doc.id,
          ...doc.data(),
        };

      });

      if (!foundUser) {

        setLoading(false);

        return;

      }

      setUserData(foundUser);

      /* Fetch Projects */

      const projectQuery = query(
        collection(db, "projects"),
        where(
          "userId",
          "==",
          foundUser.id
        )
      );

      const projectSnapshot =
        await getDocs(projectQuery);

      let projectArray = [];

      projectSnapshot.forEach((doc) => {

        projectArray.push({
          id: doc.id,
          ...doc.data(),
        });

      });

      setProjects(projectArray);

      /* Fetch Feedbacks */

      let allFeedbacks = [];

      for (let project of projectArray) {

        const feedbackQuery = query(
          collection(db, "feedbacks"),
          where(
            "projectId",
            "==",
            project.id
          )
        );

        const feedbackSnapshot =
          await getDocs(
            feedbackQuery
          );

        feedbackSnapshot.forEach((doc) => {

          allFeedbacks.push({
            id: doc.id,
            ...doc.data(),
          });

        });

      }

      setFeedbacks(allFeedbacks);

    }

    catch (error) {

      console.log(error);

    }

    finally {

      setLoading(false);

    }

  };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Loading...

      </div>

    );

  }

  if (!userData) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        Profile Not Found

      </div>

    );

  }

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce(
            (acc, item) =>
              acc +
              Number(item.rating),
            0
          ) / feedbacks.length
        ).toFixed(1)
      : 0;

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Hero */}

      <div className="bg-black text-white px-12 py-20">

        <h1 className="text-6xl font-black">

          {userData.name}

        </h1>

        <p className="text-2xl text-gray-400 mt-4">

          @{userData.username}

        </p>

        <p className="text-gray-500 mt-6 max-w-2xl">

          Freelancer performance
          profile powered by GEMANA.

        </p>

      </div>

      <div className="p-8">

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <StatsCard
            title="Projects"
            value={
              projects.length
            }
            icon="📁"
          />

          <StatsCard
            title="Reviews"
            value={
              feedbacks.length
            }
            icon="💬"
          />

          <StatsCard
            title="Rating"
            value={
              averageRating
            }
            icon="⭐"
          />

        </div>

        {/* Charts */}

        <AnalyticsCharts
          feedbacks={feedbacks}
          projects={projects}
        />

        {/* Testimonials */}

        <div className="bg-white rounded-3xl shadow p-8 mt-8">

          <h2 className="text-3xl font-black mb-8">

            Client Testimonials

          </h2>

          {feedbacks.length === 0 && (

            <p className="text-gray-500">

              No feedback available.

            </p>

          )}

          <div className="space-y-5">

            {feedbacks.map((fb) => (

              <FeedbackCard
                key={fb.id}
                fb={fb}
              />

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}

export default PublicProfile;