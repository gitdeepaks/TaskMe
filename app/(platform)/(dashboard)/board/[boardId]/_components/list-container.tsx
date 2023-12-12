"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { useAction } from "@/hooks/use-action";

import { updateCardOrder } from "@/actions/urdate-card-order";

import { updateListOrder } from "@/actions/urdate-list-oreder";
import ListForm from "./list-form";
import ListItem from "./list-item";

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

interface Card {
  id: string;
  order: number;
  // Add other properties of Card as needed
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(data);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    // Do nothing if there's no destination or if the item is dropped in the same place
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    let newOrderedData = [...orderedData];

    // Handling list reordering
    if (type === "list") {
      const reorderedLists = reorder(
        newOrderedData,
        source.index,
        destination.index
      );
      reorderedLists.forEach((list, index) => {
        list.order = index;
      });

      setOrderedData(reorderedLists);
      executeUpdateListOrder({ boardId, items: reorderedLists });
    }
    // Handling card reordering or moving
    else if (type === "card") {
      const sourceListIndex = newOrderedData.findIndex(
        (list) => list.id === source.droppableId
      );
      const destListIndex =
        destination.droppableId === source.droppableId
          ? sourceListIndex
          : newOrderedData.findIndex(
              (list) => list.id === destination.droppableId
            );

      if (sourceListIndex === -1 || destListIndex === -1) {
        return;
      }

      const sourceList = newOrderedData[sourceListIndex];
      const destList = newOrderedData[destListIndex];

      // Ensure both lists have their cards array
      sourceList.cards = sourceList.cards || [];
      destList.cards = destList.cards || [];

      // Extract the moved card
      const [movedCard] = sourceList.cards.splice(source.index, 1);

      // If moving within the same list
      if (sourceList === destList) {
        sourceList.cards.splice(destination.index, 0, movedCard);
      }
      // If moving to a different list
      else {
        movedCard.listId = destList.id; // update listId if needed
        destList.cards.splice(destination.index, 0, movedCard);
      }

      // Update order property for cards
      sourceList.cards.forEach((card, index) => {
        card.order = index;
      });
      if (sourceList !== destList) {
        destList.cards.forEach((card, index) => {
          card.order = index;
        });
      }

      setOrderedData(newOrderedData);
      executeUpdateCardOrder({ boardId, items: destList.cards });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
