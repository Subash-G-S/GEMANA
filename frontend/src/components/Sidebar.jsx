function Sidebar() {

  return (

    <div className="hidden lg:block w-[270px] bg-black text-white min-h-screen p-8">

      <h1 className="text-4xl font-black">
        GEMANA
      </h1>

      <p className="text-gray-500 mt-2">
        Freelancer Platform
      </p>

      <div className="mt-12 space-y-6">

        <button className="block text-left text-lg hover:text-gray-300">
          📊 Dashboard
        </button>

        <button className="block text-left text-lg hover:text-gray-300">
          📁 Projects
        </button>

        <button className="block text-left text-lg hover:text-gray-300">
          💬 Feedback
        </button>

        <button className="block text-left text-lg hover:text-gray-300">
          👤 Profile
        </button>

      </div>

    </div>

  );
}

export default Sidebar;