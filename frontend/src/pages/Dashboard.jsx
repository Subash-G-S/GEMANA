import { useEffect, useState } from "react";

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

function Dashboard() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [projectName, setProjectName] = useState("");

  const [clientName, setClientName] = useState("");

  const [projects, setProjects] = useState([]);

  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {

        if (currentUser) {
          setUser(currentUser);
          fetchProjects(currentUser.uid);
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

    const querySnapshot = await getDocs(q);

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
  const copyLink = (id) => {

  navigator.clipboard.writeText(
    `http://localhost:5173/feedback/${id}`
  );

  alert("Link Copied");

};
  const fetchFeedbacks = async (projectArray) => {

    let allFeedbacks = [];

    for (let project of projectArray) {

      const q = query(
        collection(db, "feedbacks"),
        where("projectId", "==", project.id)
      );

      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        allFeedbacks.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    }

    setFeedbacks(allFeedbacks);
  };

  const handleCreateProject = async (e) => {

    e.preventDefault();

    try {

      const feedbackId = uuidv4();

      await addDoc(collection(db, "projects"), {

        projectName,
        clientName,
        userId: user.uid,
        feedbackId,
        createdAt: new Date(),

      });

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

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const averageRating =
    feedbacks.length > 0
      ? (
          feedbacks.reduce(
            (acc, item) => acc + Number(item.rating),
            0
          ) / feedbacks.length
        ).toFixed(1)
      : 0;
  const communicationAverage =
  feedbacks.length > 0
    ? (
        feedbacks.reduce(
          (acc, item) =>
            acc + Number(item.communication),
          0
        ) / feedbacks.length
      ).toFixed(1)
    : 0;

  return (

    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}

      <div className="bg-white shadow px-8 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          GEMANA
        </h1>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

      <div className="p-8">

        {/* Stats */}

        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">
              Total Projects
            </h2>

            <p className="text-3xl font-bold mt-2">
              {projects.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">
              Total Feedbacks
            </h2>

            <p className="text-3xl font-bold mt-2">
              {feedbacks.length}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-gray-500">
              Average Rating
            </h2>

            <p className="text-3xl font-bold mt-2">
              {averageRating}
            </p>
          </div>

        </div>

        {/* Create Project */}

        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-xl font-bold mb-4">
            Create Project
          </h2>

          <form
            onSubmit={handleCreateProject}
            className="flex gap-4"
          >

            <input
              type="text"
              placeholder="Project Name"
              value={projectName}
              onChange={(e) =>
                setProjectName(e.target.value)
              }
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="text"
              placeholder="Client Name"
              value={clientName}
              onChange={(e) =>
                setClientName(e.target.value)
              }
              className="border p-3 rounded-lg w-full"
            />

            <button
              className="bg-black text-white px-6 rounded-lg"
            >
              Create
            </button>

          </form>

        </div>

        {/* Projects */}

        <div className="space-y-6">

          {projects.map((project) => (

            <div
              key={project.id}
              className="bg-white p-6 rounded-2xl shadow"
            >

              <div className="flex justify-between">

                <div>

                  <h2 className="text-2xl font-bold">
                    {project.projectName}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Client: {project.clientName}
                  </p>

                </div>

              </div>

              <div className="mt-4 p-4 bg-gray-100 rounded-lg">

                <p className="font-medium">
                  Feedback Link
                </p>
                
                <p className="text-sm text-gray-600 mt-1">
                  http://localhost:5173/feedback/
                  {project.feedbackId}
                </p>
                <button
  onClick={() => copyLink(project.feedbackId)}
  className="mt-3 bg-black text-white px-4 py-2 rounded-lg"
>
  Copy Link
</button>

              </div>

              <div className="mt-6">

                <h3 className="font-bold text-lg mb-3">
                  Feedbacks
                </h3>

                {feedbacks
                  .filter(
                    (fb) =>
                      fb.projectId === project.id
                  )
                  .map((fb) => (

                    <div
                      key={fb.id}
                      className="border rounded-xl p-4 mb-3"
                    >

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