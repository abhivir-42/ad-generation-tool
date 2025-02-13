'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  niche: string;
  keywords: string;
  audience: string;
}

export default function ScriptGenerationForm() {
  const [formData, setFormData] = useState<FormData>({
    niche: '',
    keywords: '',
    audience: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const result = await response.json();
      // Navigate to results page with the generated script
      router.push(`/results?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <label htmlFor="niche" className="block text-sm font-medium text-gray-700">
          Product/Service Niche
        </label>
        <input
          type="text"
          id="niche"
          name="niche"
          value={formData.niche}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., Eco-Friendly Cleaning Products"
        />
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">
          Key Features/Keywords
        </label>
        <textarea
          id="keywords"
          name="keywords"
          value={formData.keywords}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., natural ingredients, biodegradable, eco-friendly"
        />
      </div>

      <div>
        <label htmlFor="audience" className="block text-sm font-medium text-gray-700">
          Target Audience
        </label>
        <input
          type="text"
          id="audience"
          name="audience"
          value={formData.audience}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="e.g., environmentally conscious homeowners"
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? 'Generating...' : 'Generate Script'}
      </button>
    </form>
  );
} 