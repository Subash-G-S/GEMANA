import { useEffect, useState } from "react";
import AnalyticsCharts from "../components/AnalyticsCharts";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth } from "../firebase";

import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import FeedbackCard from "../components/FeedbackCard";
import EmptyState from "../components/EmptyState";

function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [projectName, setProjectName] =
    useState("");

  const [clientName, setClientName] =
    useState("");

  const [projects, setProjects] =
    useState([]);

  const [feedbacks, setFeedbacks] =
    useState([]);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {

          if (currentUser) {

            setUser(currentUser);

            fetchProjects(
              currentUser.uid
            );

          } else {

            navigate("/");

          }

          setLoading(false);

        }
      );

    return () => unsubscribe();

  }, []);

  const fetchProjects = async (uid) => {

    const q = query(
      collection(db, "projects"),
      where("userId", "==", uid)
    );

    const querySnapshot =
      await getDocs(q);

    let projectArray = [];

    querySnapshot.forEach((doc) => {

      projectArray.push({
        id: doc.id,
        ...doc.data(),
      });

    });

    setProjects(projectArray);

    fetchFeedbacks(projectArray);

  };

  const fetchFeedbacks = async (
    projectArray
  ) => {

    let allFeedbacks = [];

    for (let project of projectArray) {

      const q = query(
        collection(db, "feedbacks"),
        where(
          "projectId",
          "==",
          project.id
        )
      );

      const snapshot =
        await getDocs(q);

      snapshot.forEach((doc) => {

        allFeedbacks.push({
          id: doc.id,
          ...doc.data(),
        });

      });

    }

    setFeedbacks(allFeedbacks);

  };

  const handleCreateProject =
    async (e) => {

      e.preventDefault();

      try {

        const feedbackId =
          uuidv4();

        await addDoc(
          collection(db, "projects"),
          {
            projectName,
            clientName,
            userId: user.uid,
            feedbackId,
            createdAt: new Date(),
          }
        );

        setProjectName("");
        setClientName("");

        fetchProjects(user.uid);

      } catch (error) {

        alert(error.message);

      }

    };

  const handleLogout = async () => {

    await signOut(auth);

    navigate("/");

  };

  const copyLink = (id) => {

    navigator.clipboard.writeText(
      `http://localhost:5173/feedback/${id}`
    );

    alert("Link Copied");

  };

  if (loading) {

    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
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

      <Navbar
        handleLogout={
          handleLogout
        }
      />

      <div className="p-8">

        {/* Stats */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <StatsCard
            title="Total Projects"
            value={projects.length}
          />

          <StatsCard
            title="Total Feedbacks"
            value={feedbacks.length}
          />

          <StatsCard
            title="Average Rating"
            value={averageRating}
          />
          <AnalyticsCharts
  feedbacks={feedbacks}
  projects={projects}
/>

        </div>

        {/* Create Project */}

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-bold mb-4">
            Create Project
          </h2>

          <form
            onSubmit={
              handleCreateProject
            }
            className="flex flex-col md:flex-row gap-4"
          >

            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) =>
                setProjectName(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="text"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) =>
                setClientName(
                  e.target.value
                )
              }
              className="border p-3 rounded-lg w-full"
            />

            <button
              className="bg-black text-white px-6 py-3 rounded-lg"
            >
              Create
            </button>

          </form>

        </div>

        {/* Empty State */}

        {projects.length === 0 && (
          <EmptyState />
        )}

        {/* Projects */}

        <div className="space-y-6">

          {projects.map((project) => (

            <div
              key={project.id}
              className="bg-white p-6 rounded-2xl shadow"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-2xl font-bold">
                    {
                      project.projectName
                    }
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Client:
                    {" "}
                    {
                      project.clientName
                    }
                  </p>

                </div>

              </div>

              {/* Feedback Link */}

              <div className="mt-4 p-4 bg-gray-100 rounded-lg">

                <p className="font-medium">
                  Feedback Link
                </p>

                <p className="text-sm text-gray-600 mt-1 break-all">
                  http://localhost:5173/feedback/
                  {
                    project.feedbackId
                  }
                </p>

                <button
                  onClick={() =>
                    copyLink(
                      project.feedbackId
                    )
                  }
                  className="mt-3 bg-black text-white px-4 py-2 rounded-lg"
                >
                  Copy Link
                </button>

              </div>

              {/* Feedbacks */}

              <div className="mt-6">

                <h3 className="font-bold text-lg mb-3">
                  Feedbacks
                </h3>

                {feedbacks
                  .filter(
                    (fb) =>
                      fb.projectId ===
                      project.id
                  )
                  .length === 0 && (

                  <p className="text-gray-500">
                    No feedback yet
                  </p>

                )}

                {feedbacks
                  .filter(
                    (fb) =>
                      fb.projectId ===
                      project.id
                  )
                  .map((fb) => (

                    <FeedbackCard
                      key={fb.id}
                      fb={fb}
                    />

                  ))}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );
}

export default Dashboard;