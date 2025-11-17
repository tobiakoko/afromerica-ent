"use client";

import { forwardRef } from 'react';
import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Input } from './input';

export interface PhoneInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  defaultCountry?: string;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, placeholder, disabled, defaultCountry = 'NG' }, ref) => {
    return (
      <PhoneInputWithCountry
        international
        defaultCountry={defaultCountry as any}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        inputComponent={Input as any}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
