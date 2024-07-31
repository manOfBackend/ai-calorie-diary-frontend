import React, { useEffect, useState } from 'react';

import { Link } from 'react-router-dom';

import instance from '../api/axios';

interface DiaryEntry {
  id: string;
  content: string;
  createdAt: string;
}

const DiaryList: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await instance.get('/diary');
        setEntries(response.data);
      } catch (error) {
        console.error('Failed to fetch diary entries:', error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Diary Entries</h1>
      <Link
        to="/diary/create"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Create New Entry
      </Link>
      <ul className="space-y-4">
        {entries.map((entry) => (
          <li key={entry.id} className="bg-white shadow rounded-lg p-4">
            <Link to={`/diary/${entry.id}`} className="text-blue-500 hover:text-blue-700">
              <h2 className="text-xl font-semibold">
                {new Date(entry.createdAt).toLocaleDateString()}
              </h2>
              <p className="text-gray-600">{entry.content.substring(0, 100)}...</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DiaryList;
