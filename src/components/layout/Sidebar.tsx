import React from 'react';
import { getDataMode } from '../../data/adapters';

export function Sidebar() {
  const dataMode = getDataMode();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Global Macro</h1>
        <h2 className="text-sm text-gray-600">Intelligence</h2>
        {dataMode === 'synthetic' && (
          <div className="mt-3 px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
            Portfolio Mode
          </div>
        )}
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        <a
          href="#overview"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-900 bg-gray-100"
        >
          Overview
        </a>
        <a
          href="#growth"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Growth Indicators
        </a>
        <a
          href="#inflation"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Inflation & Prices
        </a>
        <a
          href="#monetary"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Monetary Policy
        </a>
        <a
          href="#labor"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Labor Market
        </a>
        <a
          href="#fiscal"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Fiscal Position
        </a>
        <a
          href="#trade"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Trade & FX
        </a>
        <a
          href="#risk"
          className="block px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Risk Indicators
        </a>
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        <p>© 2026 Jasmine Fosque</p>
        <p className="mt-1">Portfolio Dashboard</p>
      </div>
    </div>
  );
}
