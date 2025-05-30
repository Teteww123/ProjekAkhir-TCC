import React from 'react';
import { useParams } from 'react-router-dom';

const MovieDetailPage = () => {
  const { id } = useParams();
  return <div>Detail for movie ID: {id}</div>;
};

export default MovieDetailPage;
