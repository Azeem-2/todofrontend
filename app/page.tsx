import TodoApp from "@/components/todo";
import React from "react";

export default function Home() {
  const fetchData = async () => {
    const response = await fetch("http://localhost:8000", {
      cache: "no-store"
    });
    const data = await response.json();
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] bg-black text-white ">
      
      <TodoApp />
    </div>
  );
}
