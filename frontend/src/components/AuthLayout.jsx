function AuthLayout({ children, title, subtitle }) {

  return (

    <div className="min-h-screen bg-black flex">

      {/* Left Side */}

      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-zinc-900 via-black to-zinc-800 text-white flex-col justify-center px-16">

        <p className="uppercase tracking-[6px] text-gray-500 text-sm">
          GEMANA
        </p>

        <h1 className="text-6xl font-bold mt-6 leading-tight">
          Freelancer
          <br />
          Reputation
          <br />
          Platform
        </h1>

        <p className="text-gray-400 mt-8 text-lg leading-relaxed max-w-lg">
          Collect professional client
          feedback, analyze performance,
          and build a trusted freelancer
          profile.
        </p>

      </div>

      {/* Right Side */}

      <div className="flex-1 flex justify-center items-center p-6">

        <div className="bg-white w-full max-w-md rounded-[32px] p-10 shadow-2xl">

          <h2 className="text-4xl font-bold">
            {title}
          </h2>

          <p className="text-gray-500 mt-3 mb-8">
            {subtitle}
          </p>

          {children}

        </div>

      </div>

    </div>

  );
}

export default AuthLayout;