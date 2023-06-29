import React, { useState, useEffect } from 'react';
import "../todo.css";


const Todo = ({ isLoggedIn }) => {
    const [todo, setTodo] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('http://localhost:8080/todo', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.Todos)
                    setTodo(data.Todos);
                } else {
                    console.error('Failed to fetch Todo');
                }
            } catch (error) {
                console.error('Error fetching Todo:', error);
            }
        }

        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);

    const handleToggleStatus = (itemId) => {
        console.log(itemId)
        const updatedTodo = todo.map((item) => {
            if (item._id === itemId) {
                return {
                    ...item,
                    completed: !item.completed
                };
            }
            return item;
        });
        setTodo(updatedTodo);
    };

    const handleSearch = async () => {
        const id = localStorage.getItem('id')
        console.log(id)
        try {
            const response = await fetch(`http://localhost:8080/todo/search?query=${searchQuery}&userID=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTodo(data.Todos);
                setSearchQuery("")
            } else {
                console.error('Failed to fetch search results');
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    return (
        <div>
            {!isLoggedIn ? (
                <h1>Please log in to view your TODOs</h1>
            ) : (
                <>
                    <h1>TODOs</h1>
                    <div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                        />
                        <button onClick={handleSearch}>Search</button>
                    </div>
                    <div className="todo__container">
                        {todo.map((item) => (
                            <div key={item._id} className="todo__card">
                                <div className="todo__details">
                                    <h3 className="todo__name">Title: {item.data.title}</h3>
                                    <p className="todo__description">{item.data.description}</p>
                                    <p className="todo__description">Priority: {item.data.priority}</p>
                                    <button onClick={() => handleToggleStatus(item._id)}>
                                        {item.data.completed ? "Mark as Pending" : "Mark as Completed"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Todo;
