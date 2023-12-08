import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import React from "react";
import FormDeleteButton from "./form-delte";
import FormDelete from "./form-delte";

interface BoardProps {
  title: string;
  id: string;
}

const Board = ({ title, id }: BoardProps) => {
  const deleteboadrdWithId = deleteBoard.bind(null, id);
  return (
    <form action={deleteboadrdWithId} className="flex items-center gap-x-2">
      <p>Board title: {title}</p>
      <FormDelete />
    </form>
  );
};

export default Board;
