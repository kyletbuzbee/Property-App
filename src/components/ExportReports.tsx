"use client";

import { PropertyWithCalculations } from "@/lib/calculations";

interface ExportReportsProps {
  properties: PropertyWithCalculations[];
}

export default function ExportReports({ properties }: ExportReportsProps) {
  const exportToCSV = () => {
    const headers = [
      "Address",
      "City",
      "List Price",
      "ARV",
      "MAO 25k",
      "MAO 50k",
      "Rehab Estimate",
      "Rehab Tier",
      "Decision",
      "Rationale",
    ];

    const rows = properties.map((p) => [
      p.address,
      p.city,
      p.listPrice,
      p.afterRepairValue,
      p.mao25k,
      p.mao50k,
      p.renovationBudget,
      p.rehabTier,
      p.decision,
      `"${p.rationale.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `east_texas_flip_report_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-dark-900 border border-dark-800 p-8 rounded-sm font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-xs font-black text-white uppercase tracking-[0.3em] mb-2">
            Institutional Reporting
          </h2>
          <p className="text-[10px] text-dark-500 font-bold uppercase tracking-widest">
            Export pipeline data for external audit
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-8 py-4 bg-white text-dark-950 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary-500 hover:text-white transition-all rounded-sm"
        >
          Download Flip Pipeline (.CSV)
        </button>
      </div>
    </div>
  );
}
