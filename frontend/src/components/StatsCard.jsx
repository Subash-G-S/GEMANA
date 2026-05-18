function StatsCard({
  title,
  value,
  icon,
}) {

  return (

    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {value}
          </h2>

        </div>

        <div className="text-3xl">
          {icon}
        </div>

      </div>

    </div>

  );
}

export default StatsCard;