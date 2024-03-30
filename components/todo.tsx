"use client"
import {useState, useEffect, ReactNode} from 'react';
import axios from 'axios';
import {CirclePlus, SquarePen, CircleCheck, Trash} from 'lucide-react';

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

interface Todo {
    id : number;
    content : string;
    completed : boolean;
}

interface DialogProps {
    isOpen : boolean;
    onDismiss : () => void; // Add this line
    children?: ReactNode;
}

function TodoApp() {
    const [newTodoTitle,
        setNewTodoTitle] = useState('');
    const [todos,
        setTodos] = useState < Todo[] > ([]);
    const [error,
        setError] = useState('');

    const [isEditDialogOpen,
        setIsEditDialogOpen] = useState(false);
    const [todoToEdit,
        setTodoToEdit] = useState < Todo | null > (null);

    const fetchTodos = async() => {
        try {
            const response = await axios.get('http://localhost:8000/todos/');
            setTodos(response.data);
        } catch (error) {
            setError('Error fetching todos');
        }
    };

    const addTodo = async() => {
        try {
            await axios.post('http://localhost:8000/todos/', {content: newTodoTitle});
            setNewTodoTitle('');
            await fetchTodos();
        } catch (error) {
            setError('Error adding todo');
        }
    };

    const deleteTodo = async(todoId : number) => {
        try {
            await axios.delete(`http://localhost:8000/todos/${todoId}`);
            await fetchTodos();
        } catch (error) {
            setError('Error deleting todo');
        }
    };

    const toggleTodoCompletion = async(todoId : number, completed : boolean) => {
        try {
            await axios.put(`http://localhost:8000/todos/${todoId}`);
            await fetchTodos();
        } catch (error) {
            console.error('Error updating todo:', error);
            setError('Error updating todo completion status');
        }
    };

    const openEditDialog = (todo : Todo) => { // Remove DialogProps from here
        setTodoToEdit(todo);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async() => {
        try {
            if (!todoToEdit) 
                return; // Safety check
            
            await axios.put(`http://localhost:8000/todos/${todoToEdit.id}`, {content: newTodoTitle});
            setNewTodoTitle('');
            await fetchTodos();
            setIsEditDialogOpen(false);
            setTodoToEdit(null);

        } catch (error) {
            setError('Error editing todo');
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    // Reset the input value when a todo is selected
    useEffect(() => {
        if (todoToEdit) {
            setNewTodoTitle(todoToEdit.content);
        }
    }, [todoToEdit]);

    return (
        <div
            className='text-center font-mono border-4 bg-slate-700 border-white rounded-lg p-3 shadow-md hover:scale-150 w-1/2'>
            <h1>Welcome to todo app</h1>

            <div className='flex flex-col space-y-2 '>
                {todos.map((todo) => (
                    <div
                        className={` text-2xl bg-gray-400 ${todo.completed
                        ? 'bg-green-500'
                        : ''}`}
                        key={todo.id}>
                        <div className='flex  justify-evenly'>
                            <h1 >
                                {todo.content}
                            </h1>
                            <div className='flex justify-end'>
                                <div className=' space-x-2'>
                                    <button onClick={() => deleteTodo(todo.id)}>
                                        <Trash color="#ff0033" strokeWidth={1.75}/>
                                    </button>
                                    <button onClick={() => toggleTodoCompletion(todo.id, todo.completed)}>
                                        <CircleCheck color="#ff0033" strokeWidth={1.75}/>
                                    </button>
                                    <button onClick={() => openEditDialog(todo)}>
                                        <SquarePen color="#00ff62" strokeWidth={1.75}/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <div className='flex gap-3 text-black '>
                    <input
                        className='border-2 border-black w-full'
                        type="text"
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}/>
                    <button className='' onClick={addTodo}>
                        <CirclePlus color="#44ff00"/>
                    </button>
                </div>
                {error && <p>{error}</p>}

            </div>

            <Dialog open={isEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit TODO</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you&apos;re done.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="content" className="text-right">
                                Content
                            </Label>
                            <Input
                                id="content"
                                value={newTodoTitle}
                                onChange={(e) => setNewTodoTitle(e.target.value)}
                                className="col-span-3"/>
                        </div>

                    </div>

                    <DialogFooter>
                        <Button type="button" onClick={handleEditSubmit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default TodoApp;
