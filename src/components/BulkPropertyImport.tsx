"use client";

import { useState, useCallback } from "react";
import Papa from "papaparse";

interface ImportResult {
  imported: any[];
  failed: { index: number; error: string; data: any }[];
  summary: {
    total: number;
    success: number;
    failed: number;
    pass: number;
    caution: number;
    hardFail: number;
  };
}

interface BulkPropertyImportProps {
  onImportComplete?: (properties: any[]) => void;
  onClose?: () => void;
}

export default function BulkPropertyImport({
  onImportComplete,
  onClose,
}: BulkPropertyImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<"csv" | "json">("csv");

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (!selectedFile) return;

      setFile(selectedFile);
      setError(null);
      setPreview(null);

      // Parse and preview
      if (selectedFile.name.endsWith(".csv")) {
        Papa.parse(selectedFile, {
          header: true,
          skipEmptyLines: true,
          preview: 5,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setPreview(results.data as any[]);
            }
          },
          error: (err) => setError(`CSV parse error: ${err.message}`),
        });
      } else if (selectedFile.name.endsWith(".json")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (Array.isArray(data)) {
              setPreview(data.slice(0, 5));
            } else if (data.properties && Array.isArray(data.properties)) {
              setPreview(data.properties.slice(0, 5));
            } else {
              setError("JSON must be an array of properties or {properties: [...]}");
            }
          } catch (err) {
            setError("Invalid JSON file");
          }
        };
        reader.readAsText(selectedFile);
      }
    },
    []
  );

  const handleJsonInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setJsonInput(e.target.value);
      setError(null);

      try {
        const data = JSON.parse(e.target.value);
        if (Array.isArray(data)) {
          setPreview(data.slice(0, 5));
        } else if (data.properties && Array.isArray(data.properties)) {
          setPreview(data.properties.slice(0, 5));
        } else {
          setPreview(null);
        }
      } catch {
        setPreview(null);
      }
    },
    []
  );

  const handleImport = useCallback(async () => {
    setImporting(true);
    setError(null);
    setResult(null);

    try {
      let properties: any[] = [];

      if (activeTab === "csv" && file) {
        // Parse CSV
        const parseResult = await new Promise<Papa.ParseResult<any>>(
          (resolve, reject) => {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              complete: resolve,
              error: (err) => reject(new Error(err.message)),
            });
          }
        );
        properties = parseResult.data;
      } else if (activeTab === "json") {
        // Parse JSON
        if (jsonInput.trim()) {
          const data = JSON.parse(jsonInput);
          properties = Array.isArray(data) ? data : data.properties || [];
        } else if (file) {
          const text = await file.text();
          const data = JSON.parse(text);
          properties = Array.isArray(data) ? data : data.properties || [];
        }
      }

      if (properties.length === 0) {
        throw new Error("No properties found in file");
      }

      if (properties.length > 100) {
        throw new Error("Maximum 100 properties allowed per import");
      }

      // Send to API
      const response = await fetch("/api/properties/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          properties,
          format: activeTab,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Import failed");
      }

      setResult(data.data);

      if (data.data.imported.length > 0) {
        onImportComplete?.(data.data.imported);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  }, [activeTab, file, jsonInput, onImportComplete]);

  const inputClass =
    "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-sm text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors";

  const labelClass =
    "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1";

  return (
    <div className="w-full max-w-4xl mx-auto bg-dark-950 border border-dark-800 rounded-sm p-6">
      <div className="flex justify-between items-center mb-6 border-b border-dark-800 pb-4">
        <h2 className="text-lg font-black text-white uppercase tracking-tight">
          Bulk Import Properties
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-dark-500 hover:text-white text-sm font-black"
          >
            CLOSE_X
          </button>
        )}
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("csv")}
          className={`px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-widest transition-colors ${
            activeTab === "csv"
              ? "bg-primary-600 text-white"
              : "bg-dark-800 text-dark-400 hover:bg-dark-700"
          }`}
        >
          CSV Import
        </button>
        <button
          onClick={() => setActiveTab("json")}
          className={`px-4 py-2 rounded-sm text-sm font-bold uppercase tracking-widest transition-colors ${
            activeTab === "json"
              ? "bg-primary-600 text-white"
              : "bg-dark-800 text-dark-400 hover:bg-dark-700"
          }`}
        >
          JSON Import
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-sm text-sm mb-4">
          {error}
        </div>
      )}

      {/* CSV Tab */}
      {activeTab === "csv" && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Upload CSV File</label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className={inputClass}
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Expected columns: address, city, state, zip, price/listPrice, sqft, beds, baths, yearBuilt
            </p>
          </div>

          <div className="bg-dark-900/50 p-4 rounded-sm border border-dark-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              CSV Format Example:
            </h4>
            <pre className="text-[10px] text-slate-500 font-mono overflow-x-auto">
              {`address,city,state,zip,price,sqft,beds,baths,yearBuilt
123 Main St,Tyler,TX,75701,125000,1500,3,2,1995
456 Oak Ave,Longview,TX,75601,95000,1200,2,1,1980`}
            </pre>
          </div>
        </div>
      )}

      {/* JSON Tab */}
      {activeTab === "json" && (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>JSON Input</label>
            <textarea
              value={jsonInput}
              onChange={handleJsonInputChange}
              className={`${inputClass} h-32 font-mono text-xs`}
              placeholder="Paste JSON array here..."
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Or upload a JSON file
            </p>
          </div>

          <div>
            <label className={labelClass}>Or Upload JSON File</label>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className={inputClass}
            />
          </div>

          <div className="bg-dark-900/50 p-4 rounded-sm border border-dark-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
              JSON Format Example:
            </h4>
            <pre className="text-[10px] text-slate-500 font-mono overflow-x-auto">
              {`[
  {
    "address": "123 Main St",
    "city": "Tyler",
    "state": "TX",
    "zip": "75701",
    "listPrice": 125000,
    "sqft": 1500,
    "beds": 3,
    "baths": 2
  }
]`}
            </pre>
          </div>
        </div>
      )}

      {/* Preview */}
      {preview && preview.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
            Preview (First {preview.length} rows):
          </h4>
          <div className="bg-dark-900 rounded-sm border border-dark-800 overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-dark-800">
                  <th className="text-left p-2 text-slate-500">Address</th>
                  <th className="text-right p-2 text-slate-500">Price</th>
                  <th className="text-right p-2 text-slate-500">Sqft</th>
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-b border-dark-800/50">
                    <td className="p-2 text-slate-300">
                      {row.address || row.street || "N/A"}
                    </td>
                    <td className="p-2 text-right text-slate-300">
                      ${
                        row.listPrice ||
                          row.price ||
                          row.Price ||
                          "0"
                      }
                    </td>
                    <td className="p-2 text-right text-slate-300">
                      {row.sqft || row.Sqft || "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Import Button */}
      <div className="mt-6 flex gap-3">
        <button
          onClick={handleImport}
          disabled={importing || (!file && !jsonInput.trim())}
          className="flex-1 bg-primary-600 text-white py-3 rounded-sm text-sm font-black uppercase tracking-widest hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {importing
            ? "Analyzing & Importing..."
            : "Import Properties"}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-6 py-3 bg-dark-800 text-dark-400 rounded-sm text-sm font-black uppercase tracking-widest hover:bg-dark-700 hover:text-white transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="mt-6 border-t border-dark-800 pt-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4">
            Import Results
          </h3>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="bg-dark-900 p-3 rounded-sm border border-dark-800">
              <div className="text-lg font-bold text-white">
                {result.summary.total}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">
                Total
              </div>
            </div>
            <div className="bg-emerald-900/30 p-3 rounded-sm border border-emerald-800">
              <div className="text-lg font-bold text-emerald-400">
                {result.summary.success}
              </div>
              <div className="text-[10px] text-emerald-600 uppercase">
                Imported
              </div>
            </div>
            <div className="bg-red-900/30 p-3 rounded-sm border border-red-800">
              <div className="text-lg font-bold text-red-400">
                {result.summary.failed}
              </div>
              <div className="text-[10px] text-red-600 uppercase">
                Failed
              </div>
            </div>
            <div className="bg-primary-900/30 p-3 rounded-sm border border-primary-800">
              <div className="text-lg font-bold text-primary-400">
                {result.summary.pass}
              </div>
              <div className="text-[10px] text-primary-600 uppercase">
                PASS
              </div>
            </div>
          </div>

          {/* Decision Breakdown */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="bg-emerald-900/20 p-2 rounded-sm text-center">
              <div className="text-sm font-bold text-emerald-400">
                {result.summary.pass}
              </div>
              <div className="text-[9px] text-emerald-600 uppercase">
                Pass
              </div>
            </div>
            <div className="bg-yellow-900/20 p-2 rounded-sm text-center">
              <div className="text-sm font-bold text-yellow-400">
                {result.summary.caution}
              </div>
              <div className="text-[9px] text-yellow-600 uppercase">
                Caution
              </div>
            </div>
            <div className="bg-red-900/20 p-2 rounded-sm text-center">
              <div className="text-sm font-bold text-red-400">
                {result.summary.hardFail}
              </div>
              <div className="text-[9px] text-red-600 uppercase">
                Hard Fail
              </div>
            </div>
          </div>

          {/* Failed Items */}
          {result.failed.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-2">
                Failed Imports ({result.failed.length}):
              </h4>
              <div className="bg-red-950/30 border border-red-900 rounded-sm p-3 max-h-40 overflow-y-auto">
                {result.failed.map((fail, i) => (
                  <div
                    key={i}
                    className="text-xs text-red-300 mb-1 pb-1 border-b border-red-900/30 last:border-0"
                  >
                    Row {fail.index + 1}: {fail.error}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Message */}
          {result.imported.length > 0 && (
            <div className="mt-4 bg-emerald-900/20 border border-emerald-800 p-4 rounded-sm">
              <p className="text-emerald-400 text-sm font-bold">
                Successfully imported {result.imported.length} properties with
                AI analysis!
              </p>
              <p className="text-emerald-600 text-xs mt-1">
                Refresh the page to see them in your dashboard.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
