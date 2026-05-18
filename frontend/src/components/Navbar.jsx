function Navbar({ handleLogout }) {

  return (

    <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-8 py-5 flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-black tracking-tight">
            GEMANA
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Freelancer Reputation Platform
          </p>

        </div>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-5 py-3 rounded-2xl hover:scale-[1.03] transition-all"
        >
          Logout
        </button>

      </div>

    </div>

  );
}

export default Navbar;