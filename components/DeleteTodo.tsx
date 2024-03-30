"use client"
import { useState } from 'react';
import axios from 'axios';

interface DeleteTodoProps {
    todoContent: string;
    onDeleteSuccess: () => void;
}

function DeleteTodo({ todoContent, onDeleteSuccess }: DeleteTodoProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null); // Change type here

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
     const result = await axios.delete(`http://localhost:8000/todos/${todoContent}`);

      if (result.status === 200) {
        onDeleteSuccess();
      } else {
        setError('Error deleting todo, please try again');
      }
    } catch (error) {
      setError('Error deleting todo, please try again'); 
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export default DeleteTodo;
