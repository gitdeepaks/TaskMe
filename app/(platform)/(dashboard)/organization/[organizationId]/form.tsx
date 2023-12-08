"use client";
import { createBoard } from "@/actions/create-board";
import React from "react";
import FormInput from "./form-input";
import FormButton from "./form-button";
import { useAction } from "@/hooks/use-action";

const Form = () => {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log(data, "Sucess");
    },

    onError: (error) => {
      console.log(error, "Error");
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    execute({ title });
  };

  return (
    <form action={onSubmit}>
      <div className="flex flex-col space-y-2">
        <FormInput error={fieldErrors} />
      </div>
      <FormButton />
    </form>
  );
};

export default Form;
