"use client";
import { useMemo, useState } from "react";
import { useGlobalContext } from "@/hooks/useGlobalContext";
import ColumDropDown from "../ui/ColumDropDown";
import Card from "../ui/Card";
import { ColumPlusTasks } from "@/interfaces/Colum";
import CreateTaskBtn from "../ui/CreateTaskBtn";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

const ColumComponent = (colum: ColumPlusTasks) => {
  const { updateColum, loadTasks } = useGlobalContext();
  const [title, setTitle] = useState(colum.title);

/*   //Cargando las tareas
  useEffect(() => {
    loadTasks(colum.id, colum.projectID);
  }, []); */

  //Manejo de titulo editable de la columna
  const handleBlur = async () => {
    if (title === colum.title) {
      return null;
    } else {
      await updateColum(colum.id, {
        projectID: colum.projectID,
        title: title,
      });
    }
  };

  console.log(`render app from colum component ${colum.id}`)

  // Hook
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: colum.id,
    data: {
      type: "ColumPlusTask",
      colum,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };


  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "min-w-[300px] min-h-min h-min bg-custom-bg-gray/10 border-[1px] border-dashed border-lime-400  rounded-lg p-2 mr-4" : "min-w-[300px] min-h-min h-min  bg-custom-bg-gray  rounded-lg p-2 mr-4"}
    >
      <div
        {...attributes}
        {...listeners}
        className={isDragging ? "invisible mb-4" : "flex justify-between w-full mb-4"}
      >
        <div className="w-full ">
          <input
            className="block w-5/6 cursor-pointer bg-transparent px-3 focus:rounded-sm focus-visible:outline-lime-500 focus-visible:outline-1 focus-visible:outline-none focus-visible:shadow-custom-lime"
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            defaultValue={colum.title}
          />
        </div>
        <div className="relative w-1/6">
          <ColumDropDown
            columID={colum.id}
            projectID={colum.projectID}
            title={colum.title}
          />
        </div>
      </div>

      <div className={isDragging ? "invisible" : "flex flex-col"}>
        {colum.tasks == undefined
          ? null
          : colum.tasks.map((task) => (
              <Card key={task.id} id={task.id} title={task.title} />
            ))}
        <CreateTaskBtn projectID={colum.projectID} columID={colum.id} />
      </div>
    </div>
  );
};

export default ColumComponent;
