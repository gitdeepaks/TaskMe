"use client";
import { Input } from "@/components/ui/input";
import React from "react";
import { useFormStatus } from "react-dom";

interface FormInputProps {
  error?: {
    title?: string[];
  };
}

const FormInput = ({ error }: FormInputProps) => {
  const { pending } = useFormStatus();
  return (
    <div>
      <Input
        id="title"
        name="title"
        required
        placeholder="Enter a border title"
        className="border-black border p-1"
        disabled={pending}
      />

      {error?.title ? (
        <div>
          {error.title.map((error: string) => (
            <p key={error} className="text-rose-500">
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default FormInput;
