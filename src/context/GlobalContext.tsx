"use client";
import { createContext, useState, Dispatch, SetStateAction, useReducer } from "react";
import { Project, Colum, Task } from "@prisma/client";
import { CreateProject } from "@/interfaces/Project";
import { ColumPlusTasks, CreateColum } from "@/interfaces/Colum";
import { CreateTask } from "@/interfaces/Task";
import { TaskAction, taskReducer } from "./taskReducer";

export const GlobalContext = createContext<{
  projects: Project[];
  loadProjects: () => Promise<void>;
  createProject: (project: CreateProject) => Promise<void>;
  colums: ColumPlusTasks[];
  columsState: ColumPlusTasks[];
  dispatch: Dispatch<TaskAction>;
  loadColums: (id: string |number) => Promise<void>;
  createColum: (colum: CreateColum) => Promise<void>;
  updateColum: (id: number, colum: CreateColum) => Promise<void>
  deleteColum: (id: number, projectID: number) => Promise<void>
  updateLocalStorage: (state: ColumPlusTasks[]) => void
  tasks: Task[];
  loadTasks: (id: number, projectID: number) => Promise<void>
  createTask: (projectID: number | string, task: CreateTask) => Promise<void>
}>({
  projects: [],
  loadProjects: async () => {},
  createProject: async (project: CreateProject) => {},
  colums: [],
  columsState: [],
  dispatch: () => {},
  loadColums: async (id: string | number) => {},
  createColum: async (colum: CreateColum) => {},
  updateColum: async (id: number, colum: CreateColum) => {},
  deleteColum: async (id: number, projectID: number) => {},
  updateLocalStorage: () => {},
  tasks: [],
  loadTasks: async (id: number, projectID: number) => {},
  createTask: async (projectID: number | string, task: CreateTask) => {}
});

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [colums, setColums] = useState<ColumPlusTasks[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  let initialState: ColumPlusTasks[] = [];
  const [columsState, dispatch] = useReducer(taskReducer, initialState);


/* <-- FUNCIONES DE PROYECTOS --> */ 

  //Función para cargar los proyectos
  const loadProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  //Función para crear un proyecto
  const createProject = async (project: CreateProject) => {
    const res = await fetch(`/api/projects`, {
      method: "POST",
      body: JSON.stringify(project),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newProject = await res.json();
    setProjects([...projects, newProject]);
  };


  /* <-- FUNCIONES DE COLUMNAS --> */

  //Función para cargar las columnas
  const loadColums = async (id: number | string) => {
    const storedColums = localStorage.getItem('colums');
    if (storedColums) {
      dispatch({ type: 'SET_INITIAL_COLUMNS', payload: JSON.parse(storedColums) });
    } else {
      const res = await fetch(`/api/projects/${id}/colums`);
      const data = await res.json();
      dispatch({ type: 'SET_INITIAL_COLUMNS', payload: data });
    }
  };

  //Función para crear una columna
  const createColum = async (colum: CreateColum) => {
    const res = await fetch(`/api/projects/${colum.projectID}/colums`, {
      method: "POST",
      body: JSON.stringify(colum),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newColum = await res.json()
    dispatch({type: 'ADD_COLUM', payload: newColum})
  }

  //Función para editar el titulo de una columna
  const updateColum = async (id: number, colum: CreateColum) => {
    const res = await fetch(`/api/projects/${colum.projectID}/colums/${id}`, {
      method: "PUT",
      body: JSON.stringify(colum),
      headers: {
        "Content-Type": "application/json",
      }
    });
    const updatedColum = await res.json()
    setColums(colums.map(col => col.id == id ? updatedColum : col))
  }

  //Función para eliminar una columna
  const deleteColum = async (id: number, projectID: number) => {
    const res = await fetch(`/api/projects/${projectID}/colums/${id}`, {
      method: 'DELETE'
    })
    const data = await res.json()
    setColums(colums.filter(colum => colum.id != id))
  }

  /* <-- FUNCIONES DE TAREAS --> */

  //Función para cargar las tareas de cada columna
  const loadTasks = async (id: number, projectID: number) => {
    const res = await fetch(`/api/projects/${projectID}/colums/${id}/tasks`)
    const data = await res.json()
    setTasks(data)
  }

  //Función para crear una tarea
  const createTask = async (projectID: number | string ,task: CreateTask) => {
    const res = await fetch(`/api/projects/${projectID}/colums/${task.columID}/tasks`, {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const newTask = await res.json()
    setTasks([...tasks, newTask])
  }

  const updateLocalStorage = (state: ColumPlusTasks[]) => {
    localStorage.setItem('colums', JSON.stringify(state));
  };

  return (
    <GlobalContext.Provider value={{ projects, loadProjects, createProject, colums, columsState, dispatch,loadColums, createColum, updateColum, deleteColum, updateLocalStorage, tasks, loadTasks, createTask }}>
      {children}
    </GlobalContext.Provider>
  );
};
