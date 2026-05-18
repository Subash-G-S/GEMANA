import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

function AnalyticsCharts({
  feedbacks,
  projects,
}) {

  const positive = feedbacks.filter(
    (fb) => Number(fb.rating) >= 4
  ).length;

  const neutral = feedbacks.filter(
    (fb) => Number(fb.rating) === 3
  ).length;

  const negative = feedbacks.filter(
    (fb) => Number(fb.rating) <= 2
  ).length;

  const pieData = [
    {
      name: "Positive",
      value: positive,
    },
    {
      name: "Neutral",
      value: neutral,
    },
    {
      name: "Negative",
      value: negative,
    },
  ];

  const barData = projects.map(
    (project) => {

      const related = feedbacks.filter(
        (fb) =>
          fb.projectId === project.id
      );

      const avg =
        related.length > 0
          ? related.reduce(
              (acc, item) =>
                acc +
                Number(item.rating),
              0
            ) / related.length
          : 0;

      return {
        name: project.projectName,
        rating: avg.toFixed(1),
      };
    }
  );

  const lineData = feedbacks.map(
    (fb, index) => ({
      index: index + 1,
      rating: Number(fb.rating),
    })
  );

  return (

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

      {/* Pie Chart */}

      <div className="bg-white rounded-3xl p-6 shadow border border-gray-200">

        <h2 className="text-2xl font-bold mb-6">
          Feedback Sentiment
        </h2>

        <div className="h-[320px]">

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={110}
                label
              >

                <Cell fill="#22c55e" />
                <Cell fill="#facc15" />
                <Cell fill="#ef4444" />

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Bar Chart */}

      <div className="bg-white rounded-3xl p-6 shadow border border-gray-200">

        <h2 className="text-2xl font-bold mb-6">
          Project Ratings
        </h2>

        <div className="h-[320px]">

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={barData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="rating"
                fill="#000"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* Line Chart */}

      <div className="bg-white rounded-3xl p-6 shadow border border-gray-200 xl:col-span-2">

        <h2 className="text-2xl font-bold mb-6">
          Rating Trend
        </h2>

        <div className="h-[350px]">

          <ResponsiveContainer width="100%" height="100%">

            <LineChart data={lineData}>

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="index" />

              <YAxis />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="rating"
                stroke="#000"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );
}

export default AnalyticsCharts;