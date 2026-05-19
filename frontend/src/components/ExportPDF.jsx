import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function ExportPDF({
  userData,
  projects,
  feedbacks,
  averageRating,
}) {

  const generatePDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(24);

    doc.text(
      "GEMANA Performance Report",
      20,
      20
    );

    doc.setFontSize(14);

    doc.text(
      `Freelancer: ${userData?.name}`,
      20,
      40
    );

    doc.text(
      `Username: ${userData?.username}`,
      20,
      50
    );

    doc.text(
      `Average Rating: ${averageRating}`,
      20,
      60
    );

    doc.text(
      `Projects: ${projects.length}`,
      20,
      70
    );

    doc.text(
      `Reviews: ${feedbacks.length}`,
      20,
      80
    );

    autoTable(doc, {

      startY: 100,

      head: [[
        "Rating",
        "Communication",
        "Review"
      ]],

      body: feedbacks.map((fb)=>[

        fb.rating,

        fb.communication,

        fb.review || "-"

      ])

    });

    doc.save(
      "GEMANA_Report.pdf"
    );

  };

  return (

    <button
      onClick={generatePDF}
      className="bg-black text-white px-6 py-3 rounded-2xl"
    >

      Download Report

    </button>

  );
}

export default ExportPDF;