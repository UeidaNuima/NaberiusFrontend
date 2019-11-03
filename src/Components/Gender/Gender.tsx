import React from 'react';

const Gender: React.FC<{ gender: number }> = ({ gender }) => {
  if (gender === 0) {
    return <span style={{ color: 'blue' }}>♂</span>;
  } else if (gender === 1) {
    return <span style={{ color: 'red' }}>♀</span>;
  }
  return null;
};

export default Gender;
