"use server";

import { auth } from "@clerk/nextjs";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateBoard } from "./schema";
import { createSafeAction } from "@/lib/create-safe-action";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;

  const [imageId, imageThubUrl, imageLinkHTML, imageUserName, imageFullUrl] =
    image.split("|");

  console.log([
    imageId,
    imageThubUrl,
    imageLinkHTML,
    imageUserName,
    imageFullUrl,
  ]);

  if (
    !imageId ||
    !imageThubUrl ||
    !imageLinkHTML ||
    !imageUserName ||
    !imageFullUrl
  ) {
    return {
      error: "Missing Fields, Failed to create board.",
    };
  }

  let board;

  try {
    board = await db.board.create({
      data: {
        title,
        orgId,
        imageId,
        imageThubUrl,
        imageLinkHTML,
        imageUserName,
        imageFullUrl,
      },
    });
  } catch (error) {
    return {
      error: "Failed to create",
    };
  }

  revalidatePath(`/board/${board.id}`);

  return {
    data: board,
  };
};

export const createBoard = createSafeAction(CreateBoard, handler);
