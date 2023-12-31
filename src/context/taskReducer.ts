import { ColumPlusTasks } from "@/interfaces/Colum";
import { Reducer } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useGlobalContext } from "@/hooks/useGlobalContext";
export interface TaskAction {
      type: string;
      payload?: any;
    }

export const taskReducer: Reducer<ColumPlusTasks[], TaskAction>= (state, action) => {
      const { updateLocalStorage } = useGlobalContext();
      switch (action.type) {
            case 'SET_INITIAL_COLUMNS':
                  return action.payload as ColumPlusTasks[];

            case 'ADD_COLUM':
                  return [...state, action.payload as ColumPlusTasks];

            case 'REORDER_COLUMNS':
                  const { activeId, overId } = action.payload;
                  const activeIndex = state.findIndex((col) => col.id === activeId);
                  const overIndex = state.findIndex((col) => col.id === overId);
                  const newState = arrayMove(state, activeIndex, overIndex);
                  updateLocalStorage(newState);
                  return newState;

            default:
                  return state;
      }
}