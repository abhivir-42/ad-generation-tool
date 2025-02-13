'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ScriptLine {
  text: string;
  voice_direction: string;
}

interface ArtDirection {
  visual_style: string;
  color_palette: string[];
  typography: {
    headings: string;
    body: string;
  };
  key_elements: string[];
  layout: string;
}

interface ScriptData {
  script: {
    lines: ScriptLine[];
    estimated_duration: string;
  };
  art_direction: ArtDirection;
}

export default function ScriptResults() {
  const searchParams = useSearchParams();
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scriptData, setScriptData] = useState<ScriptData | null>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        setScriptData(JSON.parse(decodeURIComponent(data)));
      } catch (err) {
        setError('Failed to parse script data');
      }
    }
  }, [searchParams]);

  if (!scriptData) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">No script data available</p>
      </div>
    );
  }

  const handleLineClick = (index: number) => {
    setSelectedLine(selectedLine === index ? null : index);
    setFeedback('');
  };

  const handleRefineScript = async () => {
    if (selectedLine === null || !feedback) return;

    setIsRefining(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/refine-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          script: scriptData.script.lines[selectedLine].text,
          feedback,
          original_inputs: searchParams.get('inputs'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refine script');
      }

      const result = await response.json();
      // Update the script with the refined version
      const newScriptData = { ...scriptData };
      newScriptData.script.lines[selectedLine] = result.lines[0];
      setScriptData(newScriptData);
      setSelectedLine(null);
      setFeedback('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Script Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Generated Script</h2>
        <p className="text-sm text-gray-600 mb-4">
          Estimated Duration: {scriptData.script.estimated_duration}
        </p>
        <div className="space-y-4">
          {scriptData.script.lines.map((line, index) => (
            <div
              key={index}
              onClick={() => handleLineClick(index)}
              className={`p-4 rounded-lg cursor-pointer transition-colors ${
                selectedLine === index
                  ? 'bg-indigo-50 border-2 border-indigo-500'
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
            >
              <p className="font-medium">{line.text}</p>
              <p className="text-sm text-gray-600 mt-2">
                Voice Direction: {line.voice_direction}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Refinement Section */}
      {selectedLine !== null && (
        <section className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Refine Selected Line</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter your feedback for this line..."
            className="w-full p-2 border rounded-md"
            rows={3}
          />
          <button
            onClick={handleRefineScript}
            disabled={!feedback || isRefining}
            className={`mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md ${
              !feedback || isRefining ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
          >
            {isRefining ? 'Refining...' : 'Refine Line'}
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </section>
      )}

      {/* Art Direction Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Art Direction</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Visual Style</h3>
            <p>{scriptData.art_direction.visual_style}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Color Palette</h3>
            <div className="flex flex-wrap gap-2">
              {scriptData.art_direction.color_palette.map((color, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2"
                >
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{color}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Typography</h3>
            <p>Headings: {scriptData.art_direction.typography.headings}</p>
            <p>Body: {scriptData.art_direction.typography.body}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Key Visual Elements</h3>
            <ul className="list-disc list-inside">
              {scriptData.art_direction.key_elements.map((element, index) => (
                <li key={index}>{element}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Layout</h3>
            <p>{scriptData.art_direction.layout}</p>
          </div>
        </div>
      </section>
    </div>
  );
} 