import React, { useEffect, useState } from 'react';

import { useParams } from 'react-router-dom';

import instance from '../api/axios';

interface DiaryEntry {
  id: string;
  content: string;
  imageUrl: string;
  createdAt: string;
}

const DiaryEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await instance.get(`/diary/${id}`);
        setEntry(response.data);
      } catch (error) {
        console.error('Failed to fetch diary entry:', error);
      }
    };

    fetchEntry();
  }, [id]);

  if (!entry) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4">{new Date(entry.createdAt).toLocaleDateString()}</h1>
      {entry.imageUrl && (
        <img src={entry.imageUrl} alt="Food" className="w-full h-64 object-cover rounded-lg mb-4" />
      )}
      <p className="text-gray-700">{entry.content}</p>
    </div>
  );
};

export default DiaryEntry;
