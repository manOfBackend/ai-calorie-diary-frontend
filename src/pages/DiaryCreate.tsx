import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';

interface DiaryForm {
  content: string;
}

const DiaryCreate: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DiaryForm>();
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: DiaryForm) => {
    try {
      const formData = new FormData();
      formData.append('content', data.content);
      if (image) {
        formData.append('image', image);
      }

      await api.post('/diary', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      navigate('/diary');
    } catch (error) {
      console.error('Failed to create diary entry:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Create New Diary Entry</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <textarea
            id="content"
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            {...register('content', { required: 'Content is required' })}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image (optional)
          </label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Entry
        </button>
      </form>
    </div>
  );
};

export default DiaryCreate;
