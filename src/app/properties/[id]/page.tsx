"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Property,
  getPricePerSqft,
  getPricePerDoor,
  getDecisionColor,
} from "@/data/properties";

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

const NarrativeOutput = ({ text }: { text: string }) => {
  if (!text) return null;

  const sections = [
    "DECISION LINE",
    "EXECUTIVE SUMMARY",
    "OBSERVED",
    "DERIVED",
    "POLICY",
    "OPINION",
  ];

  const parsedSections: Record<string, string> = {};
  let currentSection = "GENERAL";

  text.split("\n").forEach((line) => {
    const matchingSection = sections.find((s) =>
      line.toUpperCase().startsWith(s),
    );
    if (matchingSection) {
      currentSection = matchingSection;
      parsedSections[currentSection] = line.replace(
        new RegExp(`^${matchingSection}:?\\s*`, "i"),
        "",
      );
    } else if (line.trim()) {
      parsedSections[currentSection] =
        (parsedSections[currentSection] || "") + "\n" + line;
    }
  });

  return (
    <div className="space-y-6">
      {sections.map(
        (s) =>
          parsedSections[s] && (
            <div key={s} className="border-l-2 border-primary-500 pl-4 py-1">
              <h3 className="text-xs font-bold text-primary-400 uppercase tracking-wider mb-1">
                {s}
              </h3>
              <p className="text-dark-100 whitespace-pre-wrap leading-relaxed">
                {parsedSections[s].trim()}
              </p>
            </div>
          ),
      )}
    </div>
  );
};

export default function PropertyPage({ params }: PropertyPageProps) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const resolvedParams = await params;
        const response = await fetch(`/api/properties?id=${resolvedParams.id}`);
        if (!response.ok)
          throw new Error(`Failed to fetch property: ${response.status}`);
        const data = await response.json();
        if (isMounted) setProperty(data.data);
      } catch (err) {
        if (isMounted)
          setError(
            err instanceof Error ? err.message : "Failed to fetch property",
          );
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchProperty();
    return () => {
      isMounted = false;
    };
  }, [params]);

  if (loading)
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center text-white">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
        Loading...
      </div>
    );

  if (error || !property)
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Analysis Failed</h1>
        <p className="text-dark-400 mb-8">
          {error || "Property data unavailable."}
        </p>
        <Link
          href="/"
          className="px-6 py-2 bg-primary-500 rounded hover:bg-primary-600 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-dark-950 p-6 md:p-12 font-sans selection:bg-primary-500/30">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors mb-10 text-sm uppercase tracking-widest font-bold"
        >
          ← Return to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Media & Core Info */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="px-3 py-1 rounded-sm text-[10px] font-black tracking-tighter"
                  style={{
                    backgroundColor: getDecisionColor(property.decision),
                    color: "#000",
                  }}
                >
                  {property.decision}
                </span>
                <span className="px-3 py-1 bg-dark-800 text-dark-300 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                  {property.strategy}
                </span>
                <span className="px-3 py-1 bg-primary-900/20 text-primary-400 border border-primary-500/30 rounded-sm text-[10px] font-bold uppercase tracking-widest">
                  {property.rehabTier} Rehab
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-none tracking-tight italic">
                {property.address.toUpperCase()}
              </h1>
              <p className="text-xl text-dark-400 font-medium">
                {property.city}, {property.state} {property.zip}
              </p>
            </div>

            {/* Images */}
            {property.images && property.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group overflow-hidden bg-dark-900 aspect-video rounded-sm border border-dark-800"
                  >
                    <Image
                      src={image}
                      alt={`Evidence ${index + 1}`}
                      fill
                      className="object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-500"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-video bg-dark-900 rounded-sm border border-dark-800 border-dashed flex items-center justify-center">
                <p className="text-dark-600 uppercase text-xs font-black tracking-widest">
                  No Visual Evidence Provided
                </p>
              </div>
            )}

            {/* AI Narrative Section */}
            <div className="bg-dark-900/50 p-8 rounded-sm border border-dark-800">
              <h2 className="text-sm font-black text-white mb-8 uppercase tracking-[0.2em] border-b border-dark-800 pb-4">
                Institutional Deal Analysis
              </h2>
              <NarrativeOutput text={property.rationale} />
            </div>
          </div>

          {/* Right Column: Financial Hardware */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-sm text-dark-950 space-y-8">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-dark-400 mb-1">
                  Current List Price
                </p>
                <p className="text-5xl font-black tracking-tighter">
                  ${property.listPrice.toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">
                    MAO ($25k Profit)
                  </p>
                  <p className="text-2xl font-black text-emerald-700 tracking-tight">
                    ${property.mao25k.toLocaleString()}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-sm">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                    MAO ($50k Profit)
                  </p>
                  <p className="text-2xl font-black text-blue-700 tracking-tight">
                    ${property.mao50k.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-dark-100">
                <div className="flex justify-between items-end">
                  <p className="text-xs font-bold uppercase tracking-widest text-dark-400">
                    Target ARV
                  </p>
                  <p className="text-lg font-black text-dark-900">
                    ${property.afterRepairValue.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-bold uppercase tracking-widest text-dark-400">
                    Est. Renovation
                  </p>
                  <p className="text-lg font-black text-dark-900">
                    ${property.renovationBudget.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-end text-red-600">
                  <p className="text-xs font-bold uppercase tracking-widest">
                    Holding Costs
                  </p>
                  <p className="text-lg font-black">
                    ${property.holdingCosts.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <p className="text-xs font-bold uppercase tracking-widest text-dark-400">
                    Closing Costs (8%)
                  </p>
                  <p className="text-lg font-black text-dark-900">
                    ${property.closingCosts.toLocaleString()}
                  </p>
                </div>
              </div>

              <a
                href={property.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 bg-dark-950 text-white text-center text-xs font-black uppercase tracking-[0.3em] hover:bg-primary-600 transition-colors rounded-sm"
              >
                Open Zillow Listing
              </a>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-dark-900 p-6 border border-dark-800 rounded-sm">
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-1">
                  $/sqft
                </p>
                <p className="text-xl font-black text-white">
                  ${getPricePerSqft(property).toFixed(2)}
                </p>
              </div>
              <div className="bg-dark-900 p-6 border border-dark-800 rounded-sm">
                <p className="text-[10px] font-bold text-dark-500 uppercase tracking-widest mb-1">
                  $/door
                </p>
                <p className="text-xl font-black text-white">
                  ${getPricePerDoor(property).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Metadata */}
            <div className="p-6 border border-dark-800 rounded-sm space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-dark-500">
                <span>ARV Source</span>
                <span className="text-white">{property.arvSource}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-dark-500">
                <span>Analyzed</span>
                <span className="text-white">
                  {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
