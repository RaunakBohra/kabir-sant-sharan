'use client';

import { useState } from 'react';

export function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'Kabir Sant Sharan',
    siteDescription: 'Experience the profound wisdom of Sant Kabir through teachings, community events, and spiritual guidance.',
    contactEmail: 'info@kabirsantsharan.com',
    analyticsEnabled: true,
    newsletterEnabled: true,
    commentsEnabled: true,
    maintenanceMode: false,
    defaultLanguage: 'en',
    enabledLanguages: ['en', 'hi', 'ne'],
    maxUploadSize: 10, // MB
    allowedFileTypes: ['image/jpeg', 'image/png', 'audio/mpeg', 'video/mp4', 'application/pdf']
  });

  const [activeSection, setActiveSection] = useState<'general' | 'content' | 'media' | 'advanced'>('general');

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveSettings = async () => {
    // In a real implementation, this would save to the database
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  const sections = [
    {
      id: 'general',
      label: 'General',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      )
    },
    {
      id: 'content',
      label: 'Content',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      )
    },
    {
      id: 'media',
      label: 'Media',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
        </svg>
      )
    },
    {
      id: 'advanced',
      label: 'Advanced',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="bg-dark-900 text-white px-4 py-2 rounded-md hover:bg-dark-800 transition-colors duration-200"
        >
          Save Changes
        </button>
      </div>

      <div className="bg-cream-50 rounded-lg shadow-lg border border-cream-200">
        <div className="border-b border-cream-200">
          <nav className="flex space-x-8 px-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                  activeSection === section.id
                    ? 'border-dark-900 text-dark-900'
                    : 'border-transparent text-dark-500 hover:text-dark-700 hover:border-cream-300'
                }`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeSection === 'general' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:ring-dark-500 focus:border-dark-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:ring-dark-500 focus:border-dark-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:ring-dark-500 focus:border-dark-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Default Language
                </label>
                <select
                  value={settings.defaultLanguage}
                  onChange={(e) => handleSettingChange('defaultLanguage', e.target.value)}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:ring-dark-500 focus:border-dark-900 bg-white"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिंदी)</option>
                  <option value="ne">Nepali (नेपाली)</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === 'content' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-dark-900">Analytics</h3>
                  <p className="text-sm text-dark-600">Track website visitor analytics</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.analyticsEnabled}
                    onChange={(e) => handleSettingChange('analyticsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-cream-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dark-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-900"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-dark-900">Newsletter</h3>
                  <p className="text-sm text-dark-600">Enable email newsletter subscriptions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.newsletterEnabled}
                    onChange={(e) => handleSettingChange('newsletterEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-cream-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dark-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-900"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-dark-900">Comments</h3>
                  <p className="text-sm text-dark-600">Allow user comments on teachings</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.commentsEnabled}
                    onChange={(e) => handleSettingChange('commentsEnabled', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-cream-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dark-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-900"></div>
                </label>
              </div>
            </div>
          )}

          {activeSection === 'media' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Maximum Upload Size (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxUploadSize}
                  onChange={(e) => handleSettingChange('maxUploadSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-cream-300 rounded-md focus:ring-dark-500 focus:border-dark-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Allowed File Types
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'image/jpeg', label: 'JPEG Images' },
                    { value: 'image/png', label: 'PNG Images' },
                    { value: 'audio/mpeg', label: 'MP3 Audio' },
                    { value: 'video/mp4', label: 'MP4 Video' },
                    { value: 'application/pdf', label: 'PDF Documents' }
                  ].map((type) => (
                    <label key={type.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={settings.allowedFileTypes.includes(type.value)}
                        onChange={(e) => {
                          const types = e.target.checked
                            ? [...settings.allowedFileTypes, type.value]
                            : settings.allowedFileTypes.filter(t => t !== type.value);
                          handleSettingChange('allowedFileTypes', types);
                        }}
                        className="rounded border-cream-300 text-dark-900 focus:ring-dark-500"
                      />
                      <span className="ml-2 text-sm text-dark-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'advanced' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-dark-900">Maintenance Mode</h3>
                  <p className="text-sm text-dark-600">Put the website in maintenance mode</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-cream-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-dark-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-cream-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-dark-900"></div>
                </label>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Maintenance Mode Warning
                    </h3>
                    <p className="text-sm text-yellow-700 mt-1">
                      When enabled, only administrators can access the website. Regular visitors will see a maintenance page.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
                <div className="bg-gray-50 rounded-md p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Version:</span>
                    <span className="font-medium">1.0.0</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Environment:</span>
                    <span className="font-medium">Production</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Database:</span>
                    <span className="font-medium">Cloudflare D1</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage:</span>
                    <span className="font-medium">Cloudflare R2</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}