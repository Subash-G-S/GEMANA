import { useNavigate } from "react-router-dom";

function Navbar({
  handleLogout,
  username,
}) {

  const navigate =
    useNavigate();

  return (

    <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-5 flex justify-between items-center sticky top-0 z-50">

      <div>

        <h1 className="text-3xl font-black">
          GEMANA
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Freelancer Reputation Platform
        </p>

      </div>

      <div className="flex flex-wrap gap-3">

        <button
          onClick={() =>
            navigate(
              `/profile/${username}`
            )
          }
          className="border border-black px-5 py-3 rounded-2xl hover:bg-gray-100 transition"
        >

          Profile

        </button>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-5 py-3 rounded-2xl hover:opacity-90 transition"
        >

          Logout

        </button>

      </div>

    </div>

  );
}

export default Navbar;