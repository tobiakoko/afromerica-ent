"use client"

import OtpInput from 'react-otp-input';

interface OTPInputProps {
  value: string;
  onChangeAction: (value: string) => void;
  numInputs?: number;
  disabled?: boolean;
}

export function OTPInput({ value, onChangeAction, numInputs = 6, disabled }: OTPInputProps) {
  return (
    <OtpInput
      value={value}
      onChange={onChangeAction}
      numInputs={numInputs}
      renderSeparator={<span className="mx-2">-</span>}
      renderInput={(props) => (
        <input
          {...props}
          disabled={disabled}
          className="w-12! h-14 text-center text-2xl font-bold border-2 border-input rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        />
      )}
      shouldAutoFocus
      inputType="tel"
      containerStyle="flex justify-center"
    />
  );
}