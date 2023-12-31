"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import NavBar from "@/components/NavBar/NavBar";
import ColumComponent from "@/components/Colum/Colum";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { ColumPlusTasks } from "@/interfaces/Colum";
import { createPortal } from "react-dom";

interface Params {
  params: { slug: string | number };
}

const Board = ({ params }: Params) => {
  
  //Use Effect para cargar las columnas
  useEffect(() => {
    loadColums(params.slug);
    return () => {
      localStorage.removeItem('colums');
    };
  },[]);

  const { columsState, dispatch, loadColums, createColum, createTask } =
    useGlobalContext();

  // Estado onDragStart
  const [activeColum, setActiveColum] = useState<ColumPlusTasks | null>();

  //Estado para controlar el formulario de creación de la columna
  const [showForm, setShowForm] = useState(false);
  const handleFrom = useCallback(() => {
    setShowForm((prevShowForm) => !prevShowForm);
  }, []);

  //Estado para almacenar el valor del input
  const [title, setTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  return (
    <>
      <div className="fixed max-w-[92.5%]  w-full">
        <NavBar />
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        //onDragEnd={handleDragEnd}
      >
        <div className="flex min-h-100% w-auto mt-20">
          <SortableContext
            items={columsState}
            strategy={horizontalListSortingStrategy}
          >
            {columsState.map((colum) => (
              <ColumComponent
                key={colum.id}
                id={colum.id}
                projectID={colum.projectID}
                title={colum.title}
                tasks={colum.tasks}
              />
            ))}
          </SortableContext>

          <div className="flex items-center justify-center bg-custom-gray/20 border-[1px] border-dashed border-custom-gray rounded-lg min-w-[300px] h-min">
            <button
              onClick={handleFrom}
              className={
                showForm
                  ? "hidden"
                  : "flex justify-center w-full h-full p-2 text-white/20"
              }
            >
              + crear columna
            </button>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await createColum({
                  title,
                  projectID: Number(params.slug),
                });
                handleFrom();
              }}
              className={showForm ? "flex flex-col w-full p-4" : "hidden"}
            >
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Titulo de la columna..."
                className="block w-full flex-1 border-[1px] border-custom-gray rounded-lg bg-transparent py-1.5 px-2 text-white placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 focus:outline-lime-500 "
                onChange={(e) => setTitle(e.target.value)}
                defaultValue={""}
              />
              <div className="flex items-center mt-4">
                <button
                  type="submit"
                  className=" bg-lime-400 py-2 rounded-lg w-1/3 text-custom-gray font-medium cursor-pointer"
                >
                  Crear
                </button>
                <XMarkIcon
                  onClick={handleFrom}
                  className="h-10 w-10 ml-2 text-white p-1.5 bg-custom-gray/40 rounded-lg cursor-pointer hover:bg-custom-gray"
                />
              </div>
            </form>
          </div>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColum && (
              <ColumComponent
                id={activeColum.id}
                projectID={activeColum.projectID}
                title={activeColum.title}
                tasks={activeColum.tasks}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </>
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "ColumPlusTask" && event.active.data.current.colum != activeColum) {
      setActiveColum(event.active.data.current.colum);
      console.log('este es el render ', activeColum, event.active.data.current.colum)
      //return;
    }
  }

  /*function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    dispatch({ type: 'REORDER_COLUMNS', payload: { activeId, overId } })

    setColums((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  } */
};

export default Board;
