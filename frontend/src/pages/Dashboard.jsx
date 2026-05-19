import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ExportPDF from "../components/ExportPDF";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";

import {
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import { db, auth } from "../firebase";

import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import StatsCard from "../components/StatsCard";
import FeedbackCard from "../components/FeedbackCard";
import EmptyState from "../components/EmptyState";
import AnalyticsCharts from "../components/AnalyticsCharts";

function Dashboard() {

  const navigate = useNavigate();

  const [user,setUser]=useState(null);

  const [userData,setUserData]=
    useState(null);

  const [loading,setLoading]=
    useState(true);

  const [projectName,setProjectName]=
    useState("");

  const [clientName,setClientName]=
    useState("");

  const [projects,setProjects]=
    useState([]);

  const [feedbacks,setFeedbacks]=
    useState([]);

  useEffect(()=>{

    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser)=>{

          if(currentUser){

            setUser(currentUser);

            fetchUserData(
              currentUser.uid
            );

            fetchProjects(
              currentUser.uid
            );

          }

          else{

            navigate("/");

          }

          setLoading(false);

        }
      );

    return ()=>unsubscribe();

  },[]);

  const fetchUserData =
    async(uid)=>{

      const docRef = doc(
        db,
        "users",
        uid
      );

      const docSnap =
        await getDoc(docRef);

      if(docSnap.exists()){

        setUserData(
          docSnap.data()
        );

      }

    };

  const fetchProjects =
    async(uid)=>{

      const q=query(
        collection(
          db,
          "projects"
        ),
        where(
          "userId",
          "==",
          uid
        )
      );

      const snapshot=
        await getDocs(q);

      let projectArray=[];

      snapshot.forEach((doc)=>{

        projectArray.push({
          id:doc.id,
          ...doc.data(),
        });

      });

      setProjects(projectArray);

      fetchFeedbacks(
        projectArray
      );

    };

  const fetchFeedbacks =
    async(projectArray)=>{

      let allFeedbacks=[];

      for(let project of projectArray){

        const q=query(
          collection(
            db,
            "feedbacks"
          ),
          where(
            "projectId",
            "==",
            project.id
          )
        );

        const snapshot=
          await getDocs(q);

        snapshot.forEach((doc)=>{

          allFeedbacks.push({
            id:doc.id,
            ...doc.data(),
          });

        });

      }

      setFeedbacks(
        allFeedbacks
      );

    };

  const handleCreateProject =
    async(e)=>{

      e.preventDefault();

      try{

        const feedbackId =
          uuidv4();

        await addDoc(
          collection(
            db,
            "projects"
          ),
          {

            projectName,
            clientName,

            userId:
              user.uid,

            feedbackId,

            createdAt:
              new Date(),

          }
        
        );

        setProjectName("");
        setClientName("");

        fetchProjects(
          user.uid
        );

      }

      catch(error){

        toast.error(
          error.message
        );

      }
      toast.success("Project Created");

    };

  const handleLogout =
    async()=>{

      await signOut(auth);

      navigate("/");

    };

  const copyLink=(id)=>{

    navigator.clipboard
      .writeText(
        `http://localhost:5173/feedback/${id}`
      );

    toast.success("Link Copied");

  };

  if(loading){

    return(

      <div className="min-h-screen flex justify-center items-center">

        Loading...

      </div>

    );

  }

  const averageRating =
    feedbacks.length>0
      ?(
        feedbacks.reduce(
          (acc,item)=>
            acc+
            Number(
              item.rating
            ),
          0
        )/
        feedbacks.length
      ).toFixed(1)
      :0;

  return(

    <div className="flex min-h-screen bg-gray-100">

      <Sidebar/>

      <div className="flex-1">

        <Navbar
          handleLogout={
            handleLogout
          }
          username={
            userData?.username
          }
        />

        <div className="p-8">

          {/* Welcome */}

          <div className="mb-10">

            <h1 className="text-3xl md:text-5xl font-black">

              Welcome back,
              {" "}
              {
                userData?.name
                ||"User"
              }

            </h1>

            <p className="text-gray-500 mt-3">

              Track projects,
              reviews,
              and freelancer
              performance.

            </p>

          </div>
          <div className="mt-6">

<ExportPDF
  userData={userData}
  projects={projects}
  feedbacks={feedbacks}
  averageRating={averageRating}
/>

</div>

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
              title="Feedbacks"
              value={
                feedbacks.length
              }
              icon="💬"
            />

            <StatsCard
              title="Average Rating"
              value={
                averageRating
              }
              icon="⭐"
            />

          </div>

          {/* Charts */}

          <AnalyticsCharts
            feedbacks={
              feedbacks
            }
            projects={
              projects
            }
          />

          {/* Create Project */}

          <div className="bg-white rounded-3xl shadow p-7 mb-8">

            <h2 className="text-2xl font-bold mb-5">

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
                value={
                  projectName
                }
                onChange={(e)=>
                  setProjectName(
                    e.target.value
                  )
                }
                className="border p-4 rounded-xl w-full"
              />

              <input
                type="text"
                placeholder="Client Name"
                value={
                  clientName
                }
                onChange={(e)=>
                  setClientName(
                    e.target.value
                  )
                }
                className="border p-4 rounded-xl w-full"
              />

              <button className="bg-black text-white w-full md:w-auto px-8 rounded-xl py-4">

                Create

              </button>

            </form>

          </div>

          {projects.length===0&&(
            <EmptyState/>
          )}

          {/* Projects */}

          <div className="space-y-8">

            {projects.map(
              (project)=>(

                <div
                  key={
                    project.id
                  }
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all p-7"
                >

                  <h2 className="text-3xl font-bold">

                    {
                      project.projectName
                    }

                  </h2>

                  <p className="text-gray-500 mt-2">

                    Client:
                    {" "}
                    {
                      project.clientName
                    }

                  </p>

                  <div className="mt-5 bg-gray-100 p-5 rounded-2xl">

                    <p className="font-semibold">

                      Feedback Link

                    </p>

                    <p className="break-all text-gray-600 mt-2">

                      http://localhost:5173/feedback/
                      {
                        project.feedbackId
                      }

                    </p>

                    <button
                      onClick={()=>
                        copyLink(
                          project.feedbackId
                        )
                      }
                      className="mt-4 bg-black text-white px-5 py-3 rounded-xl"
                    >

                      Copy Link

                    </button>

                  </div>

                  <div className="mt-6">

                    <h3 className="text-xl font-bold mb-4">

                      Feedbacks

                    </h3>

                    {feedbacks
                      .filter(
                        (fb)=>
                          fb.projectId===
                          project.id
                      )
                      .length===0&&(

                      <p className="text-gray-500">

                        No feedback yet

                      </p>

                    )}

                    {feedbacks
                      .filter(
                        (fb)=>
                          fb.projectId===
                          project.id
                      )
                      .map((fb)=>(

                        <FeedbackCard
                          key={fb.id}
                          fb={fb}
                        />

                      ))}

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default Dashboard;