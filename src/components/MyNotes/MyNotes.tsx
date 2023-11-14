import MyModal from "../Modal/Modal";
import { useNotes } from "@/hooks/useNotes";
import Note from "../ui/Note";
import { useEffect } from "react";

const MyNotes = () => {
  const {notes, loadNotes} = useNotes();
  useEffect(() => {
    loadNotes();
  }, [])
  return (
    <div className="grid gap-4 w-full h-full border-[1px] border-custom-gray rounded-lg p-4 overflow-scroll">
            {notes.map((note) => {
              return (
                <Note key={note.id} title={note.title} content={note.content}/>
              )
            })}
            <MyModal title="Crear Nota"/>
    </div>
  )
}

export default MyNotes