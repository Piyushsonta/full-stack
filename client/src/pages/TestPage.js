import React from 'react';
import { Link } from 'react-router-dom';

const TestPage = () => {
  return (
    <div className="container py-5">
      <h1>Test Page</h1>
      <div className="mt-4">
        <Link to="/host/meal" className="btn btn-primary btn-lg">
          Go to Host Meal Form
        </Link>
      </div>
    </div>
  );
};

export default TestPage;
