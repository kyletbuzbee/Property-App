'use client';

import { useState, useEffect } from 'react';
import clsx from 'clsx';

interface MobilePWAProps {
  // This component shows PWA capabilities and mobile optimizations
}

export default function MobilePWA({}: MobilePWAProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPWA, setIsPWA] = useState(false);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    // Check if running as PWA
    const checkPWA = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsPWA(isStandalone || isInWebAppiOS);
    };

    // Check orientation
    const checkOrientation = () => {
      setOrientation(window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');
    };

    checkMobile();
    checkPWA();
    checkOrientation();

    window.addEventListener('resize', checkMobile);
    window.addEventListener('resize', checkOrientation);
    window.matchMedia('(display-mode: standalone)').addEventListener('change', checkPWA);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  const pwaFeatures = [
    {
      icon: '📱',
      title: 'Installable App',
      description: 'Add to home screen for quick access',
      enabled: true,
    },
    {
      icon: '🔔',
      title: 'Push Notifications',
      description: 'Get alerts for new deals and updates',
      enabled: true,
    },
    {
      icon: '📴',
      title: 'Offline Mode',
      description: 'Access cached properties without internet',
      enabled: false,
    },
    {
      icon: '⚡',
      title: 'Fast Loading',
      description: 'Optimized for mobile networks',
      enabled: true,
    },
    {
      icon: '🔒',
      title: 'Secure Access',
      description: 'Biometric authentication support',
      enabled: false,
    },
    {
      icon: '📊',
      title: 'Mobile Dashboard',
      description: 'Touch-optimized property cards',
      enabled: true,
    },
  ];

  const responsiveFeatures = [
    { name: 'Viewport', value: isMobile ? 'Mobile (<768px)' : 'Desktop (≥768px)', active: true },
    { name: 'Orientation', value: orientation, active: true },
    { name: 'Touch Support', value: 'ontouchstart' in window ? 'Yes' : 'No', active: true },
    { name: 'PWA Mode', value: isPWA ? 'Installed' : 'Browser', active: isPWA },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-dark-900 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-dark-700">
        <h2 className="text-lg font-bold text-white">Mobile & PWA</h2>
        <p className="text-sm text-dark-400">Mobile optimizations and progressive web app features</p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Device Status */}
        <div className="bg-dark-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Device Status
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {responsiveFeatures.map((feature) => (
              <div 
                key={feature.name}
                className="bg-dark-700 rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-dark-400">{feature.name}</span>
                  <span className={clsx(
                    'text-xs px-2 py-0.5 rounded',
                    feature.active ? 'bg-emerald-900/30 text-emerald-400' : 'bg-dark-600 text-dark-500'
                  )}>
                    {feature.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PWA Features */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            PWA Features
          </h3>
          <div className="space-y-2">
            {pwaFeatures.map((feature) => (
              <div 
                key={feature.title}
                className="bg-dark-800 rounded-lg p-4 flex items-center gap-4"
              >
                <div className="text-2xl">{feature.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-white">{feature.title}</p>
                    <span className={clsx(
                      'text-xs px-2 py-0.5 rounded',
                      feature.enabled ? 'bg-emerald-900/30 text-emerald-400' : 'bg-dark-700 text-dark-500'
                    )}>
                      {feature.enabled ? 'Enabled' : 'Coming Soon'}
                    </span>
                  </div>
                  <p className="text-sm text-dark-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Guide */}
        {!isPWA && (
          <div className="bg-dark-800 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
              Install as App
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="text-white text-sm">iOS (Safari)</p>
                  <p className="text-dark-400 text-xs">Tap the Share button → Add to Home Screen</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="text-white text-sm">Android (Chrome)</p>
                  <p className="text-dark-400 text-xs">Tap the menu (⋮) → Install App</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="text-white text-sm">Desktop (Chrome)</p>
                  <p className="text-dark-400 text-xs">Click the install icon in the address bar</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Tips */}
        <div className="mt-6 bg-dark-800 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-dark-400 uppercase tracking-wider mb-3">
            Mobile Tips
          </h3>
          <ul className="space-y-2 text-sm text-dark-400">
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Swipe left/right on property cards to browse quickly
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Pinch to zoom on maps and scatter plots
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Double-tap to select properties in table view
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Pull down to refresh property data
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary-400">•</span>
              Use landscape mode for full dashboard views
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-dark-700">
        <button
          className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
          onClick={() => {
            // In a real app, this would trigger the PWA install prompt
            alert('PWA install prompt would appear here');
          }}
        >
          {isPWA ? 'App Installed ✓' : 'Install App'}
        </button>
      </div>
    </div>
  );
}
