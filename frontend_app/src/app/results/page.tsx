'use client';

import React from 'react';
import Link from 'next/link';
import ScriptResults from '@/components/ScriptResults';

export default function Results() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Generated Script</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Generate New Script
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg">
          <ScriptResults />
        </div>
      </div>
    </main>
  );
} 