"use client";

import { useState } from "react";
import { useProperties } from "@/context/PropertyContext";

interface ManualPropertyInputProps {
  onClose?: () => void;
  onSuccess?: () => void;
}

export default function ManualPropertyInput({
  onClose,
  onSuccess,
}: ManualPropertyInputProps) {
  const { addProperty } = useProperties();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "TX",
    zip: "",
    listPrice: "",
    sqft: "",
    bedrooms: "",
    bathrooms: "",
    yearBuilt: "",
    type: "Single Family Residence",
    url: "",
    realtor: "",
    details: "",
    annualTaxes: "",
    annualInsurance: "1200",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Generate ID from address
      const id = formData.address
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 50);

      // Parse values
      const listPrice = parseFloat(formData.listPrice) || 0;
      const sqft = parseInt(formData.sqft) || 0;
      const bedrooms = parseInt(formData.bedrooms) || 0;
      const bathrooms = parseFloat(formData.bathrooms) || 0;
      const yearBuilt = formData.yearBuilt ? parseInt(formData.yearBuilt) : null;
      const annualTaxes = parseFloat(formData.annualTaxes) || 0;
      const annualInsurance = parseFloat(formData.annualInsurance) || 1200;

      // Calculate derived values
      const arv = Math.round(listPrice * 1.25);
      const renovationBudget = Math.round(listPrice * 0.1);
      const holdingCosts = Math.round(listPrice * 0.05);
      const closingCosts = Math.round(listPrice * 0.1);
      const mao25k = Math.round(arv * 0.75 - renovationBudget - 25000);
      const mao50k = Math.round(arv * 0.75 - renovationBudget - 50000);

      // Determine decision
      let decision: "PASS" | "CAUTION" | "HARD_FAIL" = "PASS";
      if (listPrice > mao25k + 15000) decision = "HARD_FAIL";
      else if (listPrice > mao25k) decision = "CAUTION";

      const newProperty = {
        id,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        lat: 0,
        lng: 0,
        listPrice,
        equityGap: Math.round(arv * 0.2),
        sqft,
        bedrooms,
        bathrooms,
        decision,
        strategy: "Retail Flip" as const,
        status: "NEW_LEAD" as const,
        yearBuilt,
        rationale: `${formData.type}. Listed at $${listPrice.toLocaleString()}. Estimated ARV: $${arv.toLocaleString()}.`,
        type: formData.type,
        realtor: formData.realtor || null,
        url: formData.url || null,
        details: formData.details || null,
        images: [],
        annualTaxes,
        annualInsurance,
        renovationBudget,
        afterRepairValue: arv,
        notes: `Added manually on ${new Date().toLocaleDateString()}`,
        mao25k,
        mao50k,
        holdingCosts,
        closingCosts,
        rehabTier: sqft > 0 && listPrice / sqft < 80 ? "Heavy" : "Standard",
        arvSource: "Manual Entry",
        isOwned: false,
        purchasePrice: 0,
        isFavorite: false,
        favoriteNotes: "",
        dealScore: decision === "PASS" ? 80 : decision === "CAUTION" ? 50 : 20,
        riskLevel: decision === "HARD_FAIL" ? "High" : "Medium",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await addProperty(newProperty as any);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add property");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-sm text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors";

  const labelClass =
    "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1";

  return (
    <div className="w-full max-w-2xl mx-auto bg-dark-950 border border-dark-800 rounded-sm p-6">
      <div className="flex justify-between items-center mb-6 border-b border-dark-800 pb-4">
        <h2 className="text-lg font-black text-white uppercase tracking-tight">
          Add Property Manually
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

      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-400 p-3 rounded-sm text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Address Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className={labelClass}>Street Address *</label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className={inputClass}
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label className={labelClass}>City *</label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className={inputClass}
              placeholder="Tyler"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>State</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>ZIP *</label>
              <input
                type="text"
                required
                value={formData.zip}
                onChange={(e) =>
                  setFormData({ ...formData, zip: e.target.value })
                }
                className={inputClass}
                placeholder="75701"
              />
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>List Price *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.listPrice}
              onChange={(e) =>
                setFormData({ ...formData, listPrice: e.target.value })
              }
              className={inputClass}
              placeholder="150000"
            />
          </div>

          <div>
            <label className={labelClass}>Sqft *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.sqft}
              onChange={(e) =>
                setFormData({ ...formData, sqft: e.target.value })
              }
              className={inputClass}
              placeholder="1500"
            />
          </div>

          <div>
            <label className={labelClass}>Bedrooms</label>
            <input
              type="number"
              min="0"
              value={formData.bedrooms}
              onChange={(e) =>
                setFormData({ ...formData, bedrooms: e.target.value })
              }
              className={inputClass}
              placeholder="3"
            />
          </div>

          <div>
            <label className={labelClass}>Bathrooms</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.bathrooms}
              onChange={(e) =>
                setFormData({ ...formData, bathrooms: e.target.value })
              }
              className={inputClass}
              placeholder="2"
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Year Built</label>
            <input
              type="number"
              value={formData.yearBuilt}
              onChange={(e) =>
                setFormData({ ...formData, yearBuilt: e.target.value })
              }
              className={inputClass}
              placeholder="1990"
            />
          </div>

          <div>
            <label className={labelClass}>Property Type</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className={inputClass}
            >
              <option value="Single Family Residence">Single Family</option>
              <option value="Multi-Family">Multi-Family</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Condo">Condo</option>
              <option value="Mobile Home">Mobile Home</option>
              <option value="Land">Land</option>
            </select>
          </div>
        </div>

        {/* Financials */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Annual Taxes</label>
            <input
              type="number"
              value={formData.annualTaxes}
              onChange={(e) =>
                setFormData({ ...formData, annualTaxes: e.target.value })
              }
              className={inputClass}
              placeholder="2400"
            />
          </div>

          <div>
            <label className={labelClass}>Annual Insurance</label>
            <input
              type="number"
              value={formData.annualInsurance}
              onChange={(e) =>
                setFormData({ ...formData, annualInsurance: e.target.value })
              }
              className={inputClass}
              placeholder="1200"
            />
          </div>
        </div>

        {/* URLs & Notes */}
        <div>
          <label className={labelClass}>Listing URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) =>
              setFormData({ ...formData, url: e.target.value })
            }
            className={inputClass}
            placeholder="https://zillow.com/..."
          />
        </div>

        <div>
          <label className={labelClass}>Realtor/Brokerage</label>
          <input
            type="text"
            value={formData.realtor}
            onChange={(e) =>
              setFormData({ ...formData, realtor: e.target.value })
            }
            className={inputClass}
            placeholder="Keller Williams"
          />
        </div>

        <div>
          <label className={labelClass}>Notes</label>
          <textarea
            value={formData.details}
            onChange={(e) =>
              setFormData({ ...formData, details: e.target.value })
            }
            className={`${inputClass} h-20 resize-none`}
            placeholder="Any additional notes about the property..."
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4 border-t border-dark-800">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary-600 text-white py-3 rounded-sm text-sm font-black uppercase tracking-widest hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Adding..." : "Add Property"}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-dark-800 text-dark-400 rounded-sm text-sm font-black uppercase tracking-widest hover:bg-dark-700 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
