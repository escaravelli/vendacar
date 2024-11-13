import React, { useState, useEffect } from 'react';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function CurrencyInput({ value, onChange, className = '' }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState('');

  // Format number to Brazilian currency
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Convert string back to number
  const parseLocaleNumber = (stringValue: string): number => {
    const cleanedValue = stringValue.replace(/[^0-9]/g, '');
    return Number(cleanedValue) / 100;
  };

  // Initialize display value
  useEffect(() => {
    setDisplayValue(formatCurrency(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const numericValue = parseLocaleNumber(inputValue);
    
    // Update both display value and actual value
    setDisplayValue(formatCurrency(numericValue));
    onChange(numericValue);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const handleBlur = () => {
    setDisplayValue(formatCurrency(value));
  };

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
    />
  );
}