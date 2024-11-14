import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

const Card = ({ message }) => (
  <div className="bg-white rounded-lg shadow-md p-4 m-4 flex items-center">
    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
    <p className="text-gray-600 text-lg">{message}</p>
  </div>
);

export default Card;
