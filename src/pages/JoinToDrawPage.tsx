import React from 'react';
import { useParams } from 'react-router-dom';

const JoinToDrawPage = () => {
  const { uuid } = useParams();

  return <h1>Join to Draw: {uuid}</h1>;
};

export default JoinToDrawPage;
