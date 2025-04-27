import React from 'react';
import { Link } from 'react-router-dom';
import { Code } from 'lucide-react';

const CodingChallengeButton = ({ className, size = 'md', variant = 'primary' }) => {
  // Define size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };
  
  // Define variant classes
  const variantClasses = {
    primary: 'bg-green-500 text-white hover:bg-green-600',
    secondary: 'bg-indigo-100 text-green-700 hover:bg-indigo-200',
    outline: 'border-2 border-green-500 text-green-500 hover:bg-green-50',
    ghost: 'text-green-600 hover:bg-green-50'
  };
  
  // Combine classes
  const buttonClasses = `
    ${sizeClasses[size] || sizeClasses.md}
    ${variantClasses[variant] || variantClasses.primary}
    rounded-lg font-medium flex items-center justify-center transition
    ${className || ''}
  `;
  
  return (
    <Link to="/edu/coding" className={buttonClasses}>
      <Code size={size === 'lg' ? 20 : size === 'sm' ? 14 : 16} className="mr-2" />
      Coding Challenges
    </Link>
  );
};

export default CodingChallengeButton;
