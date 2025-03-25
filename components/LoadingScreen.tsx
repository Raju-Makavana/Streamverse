import React from 'react';
import { Spinner } from '@chakra-ui/react';

const LoadingScreen = () => {
  return (
    <div className="flex justify-center items-center h-screen w-full bg-transparent">
      <div className="flex flex-col items-center justify-center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        <p className="mt-4 text-lg font-medium text-gray-600">Loading content...</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 