import React from 'react';

import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Food Diary</h1>
      <p className="mb-4">Track your meals and calculate calories easily.</p>
      <Link
        to="/diary"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Start Your Diary
      </Link>
    </div>
  );
};

export default Home;
