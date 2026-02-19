'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { PropertyWithCalculations } from '@/lib/calculations';

interface ExportReportsProps {
  properties: PropertyWithCalculations[];
  onClose?: () => void;
}

type ExportFormat = 'csv' | 'json' | 'pdf';
type ReportType = 'deal-analysis' | 'portfolio-summary' | 'market-comparison' | 'equity-report';

export default function ExportReports({ properties, onClose }: ExportReportsProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [selectedReport, setSelectedReport] = useState<ReportType>('deal-analysis');
  const [isExporting, setIsExporting] = useState(false);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      'Address', 'City', 'State', 'Zip', 'List Price', 'Equity Gap', 
      'Sq Ft', 'Bedrooms', 'Bathrooms', 'Cap Rate', 'Cash-on-Cash', 
      'MAO', 'Gross Yield', '1% Rule', 'Decision', 'Strategy', 
      'Estimated Rent', 'Annual Taxes', 'Renovation Budget', 'ARV'
    ];

    const rows = properties.map(p => [
      p.address,
      p.city,
      p.state,
      p.zip,
      p.listPrice,
      p.equityGap,
      p.sqft,
      p.bedrooms,
      p.bathrooms,
      p.capRate,
      p.cashOnCashReturn,
      p.mao,
      p.grossYield,
      p.onePercentRule ? 'Yes' : 'No',
      p.decision,
      p.strategy,
      p.estimatedRent,
      p.annualTaxes,
      p.renovationBudget,
      p.afterRepairValue,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `property-export-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export to JSON
  const exportToJSON = () => {
    const jsonContent = JSON.stringify(properties, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `property-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Generate report based on selected type
  const generateReport = useMemo(() => {
    switch (selectedReport) {
      case 'deal-analysis':
        return {
          title: 'Deal Analysis Report',
          sections: [
            {
              name: 'Summary',
              data: [
                { label: 'Total Properties', value: properties.length.toString() },
                { label: 'Average Cap Rate', value: `${(properties.reduce((sum, p) => sum + p.capRate, 0) / properties.length).toFixed(2)}%` },
                { label: 'Average Cash-on-Cash', value: `${(properties.reduce((sum, p) => sum + p.cashOnCashReturn, 0) / properties.length).toFixed(2)}%` },
                { label: 'Total Equity Gap', value: `$${properties.reduce((sum, p) => sum + p.equityGap, 0).toLocaleString()}` },
              ],
            },
            {
              name: 'Top Deals by Cap Rate',
              data: properties
                .sort((a, b) => b.capRate - a.capRate)
                .slice(0, 5)
                .map(p => ({ 
                  label: p.address, 
                  value: `${p.capRate.toFixed(2)}% cap, $${p.equityGap.toLocaleString()} equity` 
                })),
            },
            {
              name: 'Properties Passing 1% Rule',
              data: [
                { label: 'Count', value: properties.filter(p => p.onePercentRule).length.toString() },
                { label: 'Percentage', value: `${((properties.filter(p => p.onePercentRule).length / properties.length) * 100).toFixed(1)}%` },
              ],
            },
          ],
        };

      case 'portfolio-summary':
        return {
          title: 'Portfolio Summary',
          sections: [
            {
              name: 'Holdings',
              data: [
                { label: 'Total Properties', value: properties.length.toString() },
                { label: 'Total List Value', value: `$${properties.reduce((sum, p) => sum + p.listPrice, 0).toLocaleString()}` },
                { label: 'Total Equity Gap', value: `$${properties.reduce((sum, p) => sum + p.equityGap, 0).toLocaleString()}` },
                { label: 'Monthly Rent Potential', value: `$${properties.reduce((sum, p) => sum + p.estimatedRent, 0).toLocaleString()}` },
              ],
            },
            {
              name: 'Strategy Distribution',
              data: Object.entries(
                properties.reduce((acc, p) => {
                  acc[p.strategy] = (acc[p.strategy] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([strategy, count]) => ({ label: strategy, value: count.toString() })),
            },
            {
              name: 'Decision Breakdown',
              data: Object.entries(
                properties.reduce((acc, p) => {
                  acc[p.decision] = (acc[p.decision] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([decision, count]) => ({ label: decision, value: count.toString() })),
            },
          ],
        };

      case 'market-comparison':
        return {
          title: 'Market Comparison',
          sections: [
            {
              name: 'Price Analysis',
              data: [
                { label: 'Average Price', value: `$${Math.round(properties.reduce((sum, p) => sum + p.listPrice, 0) / properties.length).toLocaleString()}` },
                { label: 'Highest Price', value: `$${Math.max(...properties.map(p => p.listPrice)).toLocaleString()}` },
                { label: 'Lowest Price', value: `$${Math.min(...properties.map(p => p.listPrice)).toLocaleString()}` },
                { label: 'Average $/SqFt', value: `$${(properties.reduce((sum, p) => sum + p.pricePerSqft, 0) / properties.length).toFixed(2)}` },
              ],
            },
            {
              name: 'Geographic Distribution',
              data: Object.entries(
                properties.reduce((acc, p) => {
                  acc[p.city] = (acc[p.city] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([city, count]) => ({ label: city, value: count.toString() })),
            },
          ],
        };

      case 'equity-report':
        return {
          title: 'Equity Analysis Report',
          sections: [
            {
              name: 'Equity Summary',
              data: [
                { label: 'Total Equity Gap', value: `$${properties.reduce((sum, p) => sum + p.equityGap, 0).toLocaleString()}` },
                { label: 'Average Equity per Property', value: `$${Math.round(properties.reduce((sum, p) => sum + p.equityGap, 0) / properties.length).toLocaleString()}` },
              ],
            },
            {
              name: 'Top Equity Opportunities',
              data: properties
                .sort((a, b) => b.equityGap - a.equityGap)
                .slice(0, 10)
                .map(p => ({ 
                  label: p.address, 
                  value: `$${p.equityGap.toLocaleString()}` 
                })),
            },
          ],
        };

      default:
        return null;
    }
  }, [properties, selectedReport]);

  // Handle export
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate processing
      
      switch (selectedFormat) {
        case 'csv':
          exportToCSV();
          break;
        case 'json':
          exportToJSON();
          break;
        case 'pdf':
          // For PDF, we'd typically use a library like jspdf
          // For now, we'll export as a formatted text file
          const reportText = generateReport ? JSON.stringify(generateReport, null, 2) : '';
          const blob = new Blob([reportText], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `report-${selectedReport}-${new Date().toISOString().split('T')[0]}.txt`;
          link.click();
          URL.revokeObjectURL(url);
          break;
      }
    } finally {
      setIsExporting(false);
    }
  };

  const reportTypes: { id: ReportType; label: string; description: string }[] = [
    { id: 'deal-analysis', label: 'Deal Analysis', description: 'Cap rates, cash-on-cash, 1% rule analysis' },
    { id: 'portfolio-summary', label: 'Portfolio Summary', description: 'Holdings, strategy distribution, totals' },
    { id: 'market-comparison', label: 'Market Comparison', description: 'Price analysis, geographic breakdown' },
    { id: 'equity-report', label: 'Equity Report', description: 'Equity gap analysis and opportunities' },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-dark-700">
        <div>
          <h2 className="text-lg font-bold text-white">Export & Reports</h2>
          <p className="text-sm text-dark-400">Export data or generate reports</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-dark-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Export Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Quick Export
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            {(['csv', 'json', 'pdf'] as ExportFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={clsx(
                  'p-4 rounded-lg text-center transition-colors',
                  selectedFormat === format
                    ? 'bg-primary-500 text-white'
                    : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                )}
              >
                <div className="text-2xl mb-1">
                  {format === 'csv' && '📊'}
                  {format === 'json' && '📄'}
                  {format === 'pdf' && '📑'}
                </div>
                <span className="text-sm font-medium uppercase">{format}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Section */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Generate Report
          </h3>
          
          <div className="space-y-2">
            {reportTypes.map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={clsx(
                  'w-full p-4 rounded-lg text-left transition-colors',
                  selectedReport === report.id
                    ? 'bg-primary-500/20 border border-primary-500'
                    : 'bg-dark-800 border border-transparent hover:border-dark-600'
                )}
              >
                <p className="font-medium text-white">{report.label}</p>
                <p className="text-sm text-dark-400">{report.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Report Preview */}
        {generateReport && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
              Report Preview
            </h3>
            
            <div className="bg-dark-800 rounded-lg p-4">
              <h4 className="text-lg font-bold text-white mb-4">{generateReport.title}</h4>
              
              {generateReport.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4 last:mb-0">
                  <h5 className="text-sm font-medium text-primary-400 mb-2">{section.name}</h5>
                  <div className="space-y-1">
                    {section.data.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between text-sm">
                        <span className="text-dark-400">{item.label}</span>
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Button */}
      <div className="p-4 border-t border-dark-700">
        <button
          onClick={handleExport}
          disabled={isExporting}
          className={clsx(
            'w-full py-3 rounded-lg font-medium transition-colors',
            isExporting
              ? 'bg-dark-700 text-dark-400 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600'
          )}
        >
          {isExporting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Exporting...
            </span>
          ) : (
            `Export ${selectedFormat.toUpperCase()} (${properties.length} properties)`
          )}
        </button>
      </div>
    </div>
  );
}
