// components/Loader.js
'use client'; // This marks the component as a Client Component

import React from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'react-bootstrap';
import './Loader.scss';

const Loader = () => {
  const loading = useSelector((state) => state.loader.loading);

  
  if (!loading) return null;
  
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
    </div>
  );
};

export default Loader;
