import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const [todo, setTodo] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const response = await fetch("http://localhost:3000/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        email: user.email,
        password: user.password,
      },
    });

    const data = await response.json();

    setTodos(data.todos);
  };

  const handleAdd = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (todo == "") {
      alert("Insert a todo");
    } else {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          email: user.email,
          password: user.password,
        },
        body: JSON.stringify({
          title: todo,
          isCompleted: false,
        }),
      });

      const data = await response.json();
      console.log(data);

      setTodo("");

      getTodos();
    }
  };

  const handleDelete = async (id) => {
    // Delete the todo with the given id
    const user = JSON.parse(localStorage.getItem("user"));

    const response = await fetch("http://localhost:3000/todos", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        email: user.email,
        password: user.password,
      },
      body: JSON.stringify({
        id: id,
      }),
    });

    const data = await response.json();
    console.log(data);

    getTodos();
  };

  const handleEdit = async (id) => {
    const todo = prompt("Enter the new todo");

    // Delete the todo with the given id
    const user = JSON.parse(localStorage.getItem("user"));

    const response = await fetch("http://localhost:3000/todos", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        email: user.email,
        password: user.password,
      },
      body: JSON.stringify({
        id: id,
        title: todo,
        isCompleted: false,
      }),
    });

    const data = await response.json();
    console.log(data);

    getTodos();
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Todo List</h1>

      <div className="flex flex-row">
        <input
          className="rounded-md appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          onClick={handleAdd}
        >
          Submit
        </button>
      </div>

      <ul className="space-y-4">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="bg-white shadow overflow-hidden rounded-md p-4 flex items-center justify-between"
          >
            <div>
              <p className="text-lg">{todo.title}</p>
            </div>

            <div>
              <button className="p-1 m-1" onClick={() => handleEdit(todo.id)}>
                Edit
              </button>
              <button className="p-1 m-1" onClick={() => handleDelete(todo.id)}>
                x
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
