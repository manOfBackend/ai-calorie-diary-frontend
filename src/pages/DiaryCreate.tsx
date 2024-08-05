import React, { useState, ChangeEvent, FormEvent } from 'react';

import { useNavigate } from 'react-router-dom';

import axiosInstance from '../api/axios';
import { useAuth } from '../stores/authStore';

interface FoodAnalysisRequest {
  image: File | null;
  description: string;
}

interface Ingredient {
  protein: { amount: number; unit: string; calories: number };
  fat: { amount: number; unit: string; calories: number };
  carbohydrate: { amount: number; unit: string; calories: number };
}

interface FoodAnalysis {
  totalCalories: number;
  breakdown: { [ingredient: string]: Ingredient };
}

const DiaryCreate: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [content, setContent] = useState<string>('');
  const [diaryImage, setDiaryImage] = useState<File | null>(null);
  const [foodAnalysisRequest, setFoodAnalysisRequest] = useState<FoodAnalysisRequest>({
    image: null,
    description: '',
  });
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleDiaryImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDiaryImage(e.target.files[0]);
    }
  };

  const handleFoodImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFoodAnalysisRequest((prev) => ({ ...prev, image: e.target.files?.[0] ?? null }));
    }
  };

  const handleFoodDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFoodAnalysisRequest((prev) => ({ ...prev, description: e.target.value }));
  };

  const analyzeFoodImage = async () => {
    if (!foodAnalysisRequest.image || !foodAnalysisRequest.description) {
      setError('이미지와 음식 설명을 모두 입력해주세요.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', foodAnalysisRequest.image);
    formData.append('description', foodAnalysisRequest.description);

    try {
      const response = await axiosInstance.post<FoodAnalysis>('/food/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 30000,
      });

      setFoodAnalysis(response.data);

      const analysisText = `
        음식 분석 결과:
        - 총 칼로리: ${response.data.totalCalories}kcal
        - 영양 성분 분석:
          ${Object.entries(response.data.breakdown)
            .map(
              ([ingredient, nutrients]) =>
                `${ingredient}: 
               단백질: ${nutrients.protein.amount}${nutrients.protein.unit} (${nutrients.protein.calories}kcal),
               지방: ${nutrients.fat.amount}${nutrients.fat.unit} (${nutrients.fat.calories}kcal),
               탄수화물: ${nutrients.carbohydrate.amount}${nutrients.carbohydrate.unit} (${nutrients.carbohydrate.calories}kcal)`
            )
            .join('\n          ')}
      `;

      setContent((prevContent) => prevContent + '\n\n' + analysisText);
    } catch (error) {
      console.error('음식 분석 중 오류 발생:', error);
      setError('음식 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('다이어리 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('content', content);
    if (diaryImage) {
      formData.append('image', diaryImage);
    }
    if (foodAnalysis) {
      formData.append('totalCalories', foodAnalysis.totalCalories.toString());
      formData.append('calorieBreakdown', JSON.stringify(foodAnalysis.breakdown));
    }

    try {
      await axiosInstance.post('/diary', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('다이어리 엔트리가 성공적으로 생성되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('다이어리 엔트리 생성 중 오류 발생:', error);
      setError('다이어리 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-600">새 다이어리 작성</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="content" className="block mb-2 font-semibold text-gray-700">
            내용:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={handleContentChange}
            rows={10}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
            required
          />
        </div>
        <div>
          <label htmlFor="diaryImage" className="block mb-2 font-semibold text-gray-700">
            다이어리 이미지:
          </label>
          <input
            type="file"
            id="diaryImage"
            accept="image/*"
            onChange={handleDiaryImageChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
          />
        </div>
        <div className="bg-gray-50 p-6 rounded-md">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">음식 분석</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="foodImage" className="block mb-2 font-semibold text-gray-700">
                음식 이미지:
              </label>
              <input
                type="file"
                id="foodImage"
                accept="image/*"
                onChange={handleFoodImageChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            <div>
              <label htmlFor="foodDescription" className="block mb-2 font-semibold text-gray-700">
                음식 설명:
              </label>
              <input
                type="text"
                id="foodDescription"
                value={foodAnalysisRequest.description}
                onChange={handleFoodDescriptionChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
              />
            </div>
            <button
              type="button"
              onClick={analyzeFoodImage}
              disabled={isAnalyzing}
              className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-indigo-300 transition duration-300"
            >
              {isAnalyzing ? '분석 중...' : '음식 분석하기'}
            </button>
          </div>
        </div>
        {foodAnalysis && (
          <div className="bg-indigo-50 p-6 rounded-md">
            <h3 className="text-xl font-bold mb-4 text-indigo-600">분석 결과</h3>
            <p className="mb-4">
              <span className="font-semibold">총 칼로리:</span> {foodAnalysis.totalCalories}kcal
            </p>
            <h4 className="font-semibold mb-2 text-lg">영양 성분 분석:</h4>
            <ul className="space-y-2">
              {Object.entries(foodAnalysis.breakdown).map(([ingredient, nutrients]) => (
                <li key={ingredient} className="bg-white p-3 rounded-md shadow">
                  <p className="font-semibold text-indigo-600">{ingredient}</p>
                  <p>
                    단백질: {nutrients.protein.amount}
                    {nutrients.protein.unit} ({nutrients.protein.calories}kcal)
                  </p>
                  <p>
                    지방: {nutrients.fat.amount}
                    {nutrients.fat.unit} ({nutrients.fat.calories}kcal)
                  </p>
                  <p>
                    탄수화물: {nutrients.carbohydrate.amount}
                    {nutrients.carbohydrate.unit} ({nutrients.carbohydrate.calories}kcal)
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 transition duration-300 text-lg font-semibold"
        >
          {isSubmitting ? '저장 중...' : '다이어리 저장'}
        </button>
      </form>
    </div>
  );
};

export default DiaryCreate;
