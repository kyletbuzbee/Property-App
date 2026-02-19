'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Property, 
  getPricePerSqft, 
  getPricePerDoor, 
  getDecisionColor, 
  calculateCapRate,
  calculateCashOnCashReturn,
  calculateMAO,
  calculateOnePercentRule,
  calculateGrossYield
} from '@/data/properties';

interface PropertyPageProps {
  params: Promise<{ id: string }>;
}

export default function PropertyPage({ params }: PropertyPageProps) {
  const [propertyId, setPropertyId] = useState<string>('');
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  let isMounted = true;
  
  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      // Await the params Promise (required in Next.js 15)
      const resolvedParams = await params;
      
      if (!isMounted) return;
      
      const response = await fetch(`/api/properties?id=${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.status}`);
      }

      const data = await response.json();
      if (isMounted) {
        setProperty(data.data);
      }
    } catch (err) {
      console.error('Error fetching property:', err);
      if (isMounted) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchProperty();
  
  return () => {
    isMounted = false;
  };
}, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="flex items-center gap-3 text-white">
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span>Loading property...</span>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-2">Property Not Found</h1>
        <p className="text-dark-400 mb-6">{error || 'The property you are looking for does not exist.'}</p>
        <Link 
          href="/"
          className="px-4 py-2 bg-primary-500 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-colors mb-6"
          >
            <span className="text-lg">←</span>
            Return to Dashboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: `${getDecisionColor(property.decision)}20`,
                    color: getDecisionColor(property.decision),
                  }}
                >
                  {property.decision}
                </span>
                <span className="px-3 py-1 bg-dark-800 text-white rounded-full text-xs font-semibold">
                  {property.strategy}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">{property.address}</h1>
              <p className="text-xl text-dark-400">
                {property.city}, {property.state} {property.zip}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={property.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View on Zillow
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Property Details</h2>
              
              {property.images && property.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {property.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg"
                      width={400}
                      height={300}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ))}
                </div>
              ) : (
                <div className="w-full h-48 bg-dark-700 rounded-lg flex items-center justify-center mb-6">
                  <p className="text-dark-400">No images available</p>
                </div>
              )}

              {/* Basic Information */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-dark-400 mb-1">List Price</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    ${property.listPrice.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-400 mb-1">Square Feet</p>
                  <p className="text-lg font-semibold text-white">
                    {property.sqft.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-dark-400 mb-1">Bedrooms</p>
                  <p className="text-lg font-semibold text-white">{property.bedrooms}</p>
                </div>
                <div>
                  <p className="text-sm text-dark-400 mb-1">Bathrooms</p>
                  <p className="text-lg font-semibold text-white">{property.bathrooms}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-dark-400 mb-2">Type</p>
                <p className="text-white">{property.type}</p>
              </div>

              {property.details && (
                <div className="mt-4">
                  <p className="text-sm text-dark-400 mb-2">Details</p>
                  <p className="text-white">{property.details}</p>
                </div>
              )}

              {property.realtor && (
                <div className="mt-4">
                  <p className="text-sm text-dark-400 mb-2">Realtor</p>
                  <p className="text-white">{property.realtor}</p>
                </div>
              )}

              {property.notes && (
                <div className="mt-4">
                  <p className="text-sm text-dark-400 mb-2">Notes</p>
                  <p className="text-white">{property.notes}</p>
                </div>
              )}
            </div>

            {/* Rationale */}
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Investment Rationale</h2>
              <p className="text-dark-300">{property.rationale}</p>
            </div>
          </div>

          {/* Financial Analysis */}
          <div className="space-y-6">
            <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Financial Analysis</h2>

              {/* Price Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Price per SqFt</p>
                    <p className="text-sm font-semibold text-white">
                      ${getPricePerSqft(property).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Price per Door</p>
                    <p className="text-sm font-semibold text-white">
                      ${getPricePerDoor(property).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Equity Gap</p>
                    <p className="text-sm font-semibold text-amber-400">
                      ${property.equityGap.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-dark-700" />

              {/* Investment Metrics */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Cap Rate</p>
                    <p className="text-sm font-semibold text-white">
                      {calculateCapRate(property).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Cash-on-Cash Return</p>
                    <p className="text-sm font-semibold text-white">
                      {calculateCashOnCashReturn(property).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Gross Yield</p>
                    <p className="text-sm font-semibold text-white">
                      {calculateGrossYield(property).toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">1% Rule</p>
                    <p className={`text-sm font-semibold ${
                      calculateOnePercentRule(property) ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {calculateOnePercentRule(property) ? 'Pass' : 'Fail'}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">MAO</p>
                    <p className="text-sm font-semibold text-emerald-400">
                      ${calculateMAO(property).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <hr className="my-6 border-dark-700" />

              {/* Expense Estimates */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Estimated Rent</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.estimatedRent.toLocaleString()}/mo
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Annual Taxes</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.annualTaxes.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Annual Insurance</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.annualInsurance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">Renovation Budget</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.renovationBudget.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-dark-400">ARV</p>
                    <p className="text-sm font-semibold text-white">
                      ${property.afterRepairValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-dark-800 rounded-lg border border-dark-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-dark-400 mb-1">Created At</p>
              <p className="text-white">{new Date(property.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">Last Updated</p>
              <p className="text-white">{new Date(property.updatedAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-dark-400 mb-1">Property ID</p>
              <p className="text-white font-mono">{property.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
