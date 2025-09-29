'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from '@/components/ui/toast';
import { Label } from '@/components/ui/label';

interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  isActive: boolean;
  preferences: {
    teachings: boolean;
    events: boolean;
    meditation: boolean;
  };
}

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscribers: NewsletterSubscriber[];
}

type ExportFormat = 'csv' | 'json' | 'excel';

export function ExportDialog({ open, onOpenChange, subscribers }: ExportDialogProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [selectedFields, setSelectedFields] = useState({
    email: true,
    name: true,
    subscribedAt: true,
    status: true,
    preferences: true
  });

  const handleFieldToggle = (field: keyof typeof selectedFields) => {
    setSelectedFields(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const convertToCSV = (data: NewsletterSubscriber[]): string => {
    const headers: string[] = [];
    if (selectedFields.email) headers.push('Email');
    if (selectedFields.name) headers.push('Name');
    if (selectedFields.subscribedAt) headers.push('Subscribed At');
    if (selectedFields.status) headers.push('Status');
    if (selectedFields.preferences) headers.push('Teachings', 'Events', 'Meditation');

    const rows = data.map(sub => {
      const row: string[] = [];
      if (selectedFields.email) row.push(`"${sub.email}"`);
      if (selectedFields.name) row.push(`"${sub.name || ''}"`);
      if (selectedFields.subscribedAt) row.push(`"${new Date(sub.subscribedAt).toLocaleDateString()}"`);
      if (selectedFields.status) row.push(`"${sub.isActive ? 'Active' : 'Inactive'}"`);
      if (selectedFields.preferences) {
        row.push(sub.preferences.teachings ? 'Yes' : 'No');
        row.push(sub.preferences.events ? 'Yes' : 'No');
        row.push(sub.preferences.meditation ? 'Yes' : 'No');
      }
      return row.join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  };

  const convertToJSON = (data: NewsletterSubscriber[]): string => {
    const filtered = data.map(sub => {
      const result: Record<string, unknown> = {};
      if (selectedFields.email) result.email = sub.email;
      if (selectedFields.name) result.name = sub.name || '';
      if (selectedFields.subscribedAt) result.subscribedAt = sub.subscribedAt;
      if (selectedFields.status) result.isActive = sub.isActive;
      if (selectedFields.preferences) result.preferences = sub.preferences;
      return result;
    });
    return JSON.stringify(filtered, null, 2);
  };

  const convertToExcel = (data: NewsletterSubscriber[]): string => {
    // Excel XML format (SpreadsheetML)
    let xml = '<?xml version="1.0"?>\n';
    xml += '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"\n';
    xml += ' xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">\n';
    xml += '<Worksheet ss:Name="Subscribers">\n<Table>\n';

    // Headers
    xml += '<Row>\n';
    if (selectedFields.email) xml += '<Cell><Data ss:Type="String">Email</Data></Cell>\n';
    if (selectedFields.name) xml += '<Cell><Data ss:Type="String">Name</Data></Cell>\n';
    if (selectedFields.subscribedAt) xml += '<Cell><Data ss:Type="String">Subscribed At</Data></Cell>\n';
    if (selectedFields.status) xml += '<Cell><Data ss:Type="String">Status</Data></Cell>\n';
    if (selectedFields.preferences) {
      xml += '<Cell><Data ss:Type="String">Teachings</Data></Cell>\n';
      xml += '<Cell><Data ss:Type="String">Events</Data></Cell>\n';
      xml += '<Cell><Data ss:Type="String">Meditation</Data></Cell>\n';
    }
    xml += '</Row>\n';

    // Data rows
    data.forEach(sub => {
      xml += '<Row>\n';
      if (selectedFields.email) xml += `<Cell><Data ss:Type="String">${sub.email}</Data></Cell>\n`;
      if (selectedFields.name) xml += `<Cell><Data ss:Type="String">${sub.name || ''}</Data></Cell>\n`;
      if (selectedFields.subscribedAt) xml += `<Cell><Data ss:Type="String">${new Date(sub.subscribedAt).toLocaleDateString()}</Data></Cell>\n`;
      if (selectedFields.status) xml += `<Cell><Data ss:Type="String">${sub.isActive ? 'Active' : 'Inactive'}</Data></Cell>\n`;
      if (selectedFields.preferences) {
        xml += `<Cell><Data ss:Type="String">${sub.preferences.teachings ? 'Yes' : 'No'}</Data></Cell>\n`;
        xml += `<Cell><Data ss:Type="String">${sub.preferences.events ? 'Yes' : 'No'}</Data></Cell>\n`;
        xml += `<Cell><Data ss:Type="String">${sub.preferences.meditation ? 'Yes' : 'No'}</Data></Cell>\n`;
      }
      xml += '</Row>\n';
    });

    xml += '</Table>\n</Worksheet>\n</Workbook>';
    return xml;
  };

  const handleExport = async () => {
    if (!selectedFields.email && !selectedFields.name && !selectedFields.subscribedAt && !selectedFields.status && !selectedFields.preferences) {
      toast.error('Please select at least one field to export');
      return;
    }

    setIsExporting(true);

    try {
      const dataToExport = includeInactive
        ? subscribers
        : subscribers.filter(s => s.isActive);

      if (dataToExport.length === 0) {
        toast.error('No subscribers to export');
        setIsExporting(false);
        return;
      }

      let content: string;
      let mimeType: string;
      let filename: string;

      switch (format) {
        case 'csv':
          content = convertToCSV(dataToExport);
          mimeType = 'text/csv';
          filename = `subscribers_${Date.now()}.csv`;
          break;
        case 'json':
          content = convertToJSON(dataToExport);
          mimeType = 'application/json';
          filename = `subscribers_${Date.now()}.json`;
          break;
        case 'excel':
          content = convertToExcel(dataToExport);
          mimeType = 'application/vnd.ms-excel';
          filename = `subscribers_${Date.now()}.xls`;
          break;
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${dataToExport.length} subscribers as ${format.toUpperCase()}`);
      onOpenChange(false);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export subscribers');
    } finally {
      setIsExporting(false);
    }
  };

  const dataCount = includeInactive
    ? subscribers.length
    : subscribers.filter(s => s.isActive).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-dark-900">
            Export Subscribers
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label className="text-dark-900 font-medium">Export Format</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'csv' as const, label: 'CSV', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
                { value: 'json' as const, label: 'JSON', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
                { value: 'excel' as const, label: 'Excel', icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' }
              ].map((fmt) => (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => setFormat(fmt.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    format === fmt.value
                      ? 'border-teal-600 bg-teal-50'
                      : 'border-cream-300 bg-white hover:border-cream-400'
                  }`}
                >
                  <svg className={`w-6 h-6 mx-auto mb-2 ${format === fmt.value ? 'text-teal-600' : 'text-dark-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={fmt.icon}/>
                  </svg>
                  <span className={`text-sm font-medium ${format === fmt.value ? 'text-teal-600' : 'text-dark-700'}`}>
                    {fmt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Fields Selection */}
          <div className="space-y-3">
            <Label className="text-dark-900 font-medium">Include Fields</Label>
            <div className="space-y-2 bg-cream-50 rounded-lg p-4">
              {[
                { key: 'email' as const, label: 'Email Address', required: true },
                { key: 'name' as const, label: 'Name' },
                { key: 'subscribedAt' as const, label: 'Subscribe Date' },
                { key: 'status' as const, label: 'Status (Active/Inactive)' },
                { key: 'preferences' as const, label: 'Email Preferences' }
              ].map((field) => (
                <label key={field.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFields[field.key]}
                    onChange={() => handleFieldToggle(field.key)}
                    disabled={field.required}
                    className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500 disabled:opacity-50"
                  />
                  <span className="text-sm text-dark-900">
                    {field.label}
                    {field.required && <span className="text-teal-600 ml-1">*</span>}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Include Inactive */}
          <div className="space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={includeInactive}
                onChange={(e) => setIncludeInactive(e.target.checked)}
                className="w-4 h-4 text-teal-600 border-cream-300 rounded focus:ring-teal-500"
              />
              <span className="text-sm text-dark-900">Include inactive subscribers</span>
            </label>
          </div>

          {/* Summary */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-teal-900">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="text-sm font-medium">
                Ready to export {dataCount} subscriber{dataCount !== 1 ? 's' : ''} as {format.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-dark-700 bg-cream-200 rounded-lg hover:bg-cream-300 transition-colors"
            disabled={isExporting}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Export {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}