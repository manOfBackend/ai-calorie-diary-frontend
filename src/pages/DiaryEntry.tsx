import React, { useEffect, useState } from 'react';

import { useParams, useNavigate } from 'react-router-dom';

import instance from '../api/axios';

interface Ingredient {
  protein: { amount: number; unit: string; calories: number };
  fat: { amount: number; unit: string; calories: number };
  carbohydrate: { amount: number; unit: string; calories: number };
}

interface FoodBreakdown {
  [ingredient: string]: Ingredient;
}

interface DiaryEntry {
  id: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  totalCalories: number;
  calorieBreakdown: FoodBreakdown;
}

const DiaryEntry: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<DiaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      setIsLoading(true);
      try {
        const response = await instance.get(`/diary/${id}`);
        setEntry(response.data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch diary entry:', error);
        setError('Failed to load diary entry. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      try {
        await instance.delete(`/diary/${id}`);
        navigate('/diary');
      } catch (error) {
        console.error('Failed to delete diary entry:', error);
        setError('Failed to delete diary entry. Please try again.');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (!entry) {
    return <div className="text-center p-4">Diary entry not found.</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">{new Date(entry.createdAt).toLocaleDateString()}</h1>
      {entry.imageUrl && (
        <img src={entry.imageUrl} alt="Food" className="w-full h-64 object-cover rounded-lg mb-4" />
      )}
      <p className="text-gray-700 mb-6">{entry.content}</p>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Food Analysis</h2>
        <p className="text-lg font-medium mb-2">Total Calories: {entry.totalCalories} kcal</p>
        <div className="space-y-2">
          {Object.entries(entry.calorieBreakdown).map(([ingredient, nutrients]) => (
            <div key={ingredient} className="bg-gray-100 p-3 rounded">
              <h3 className="font-medium">{ingredient}</h3>
              <p>
                Protein: {nutrients.protein.amount}
                {nutrients.protein.unit} ({nutrients.protein.calories} kcal)
              </p>
              <p>
                Fat: {nutrients.fat.amount}
                {nutrients.fat.unit} ({nutrients.fat.calories} kcal)
              </p>
              <p>
                Carbohydrate: {nutrients.carbohydrate.amount}
                {nutrients.carbohydrate.unit} ({nutrients.carbohydrate.calories} kcal)
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={() => navigate(`/diary/edit/${id}`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DiaryEntry;
