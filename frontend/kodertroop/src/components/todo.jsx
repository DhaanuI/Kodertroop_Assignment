import React, { useState, useEffect } from 'react';
import "../todo.css";


const Todo = ({ isLoggedIn }) => {
    const [todo, setTodo] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newTodo, setNewTodo] = useState({
        title: '',
        description: '',
        priority: 'high'
    });

    useEffect(() => {
        if (isLoggedIn) {
            fetchData();
        }
    }, [isLoggedIn]);


    useEffect(() => {
        const fetchSearchResults = async () => {
            const id = localStorage.getItem('id')
            let url;
            if (searchQuery == "") {
                url = "http://localhost:8080/todo"
            }
            else url = `http://localhost:8080/todo/search?query=${searchQuery}&userID=${id}`
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: localStorage.getItem('token')
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTodo(data.Todos);
                } else {
                    console.error('Failed to fetch search results');
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };
        if (isLoggedIn) {
            fetchSearchResults();
        }
    }, [searchQuery]);

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
                setTodo(data.Todos);
            } else {
                console.error('Failed to fetch Todo');
            }
        } catch (error) {
            console.error('Error fetching Todo:', error);
        }
    }


    const handleFormOpen = () => {
        setIsFormOpen(true);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setNewTodo({
            title: '',
            description: '',
            priority: 'high'
        });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (newTodo.title == '' || newTodo.description == '' || newTodo.priority == '') {
            return alert("Please fill all the fields")
        }
        try {
            const response = await fetch('http://localhost:8080/todo/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                },
                body: JSON.stringify(newTodo)
            });

            if (response.ok) {
                alert("TODO added successfully")
                fetchData();
            } else {
                console.error('Failed to add TODO');
            }
        } catch (error) {
            console.error('Error adding TODO:', error);
        }

        handleFormClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTodo((prevTodo) => ({
            ...prevTodo,
            [name]: value
        }));
    };

    const handleDeletion = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/todo/delete/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                }
            });

            if (response.ok) {
                alert("Todo Deleted")
                fetchData();

            } else {
                console.error('Failed to delete the Todo');
            }
        } catch (error) {
            console.error('Error deleting the Todo:', error);
        }
    };


    return (
        <div>
            {!isLoggedIn ? (
                <>
                    <h1>Please Signup/LogIn to VIEW/ADD your ToDos</h1>

                    <img src="https://media.istockphoto.com/id/514914078/photo/coffee-cup-and-notebook-with-to-do-list-planning-concept.jpg?s=612x612&w=0&k=20&c=tdDk8tf5DsPt3n3Iuzcj5mwJKo0ExKFgJO1j5BFlnAA=" alt="" /></>
            ) : (
                <>
                    <h1>TODOs</h1>
                    <div className='searching'>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search"
                        />
                    </div>

                    <div className='add'>
                        <button onClick={handleFormOpen}>Add Todo</button>
                    </div>

                    {isFormOpen && (
                        <div className="todo__form">
                            <form onSubmit={handleFormSubmit}>
                                <h3>Add Todo</h3>
                                <div>
                                    <label>Title:</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newTodo.title}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Description:</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={newTodo.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div>
                                    <label>Priority:</label>
                                    <select
                                        name="priority"
                                        value={newTodo.priority}
                                        onChange={handleInputChange}
                                    >
                                        <option value="high">High</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                                <button type="submit">Submit</button>
                                <button type="button" onClick={handleFormClose}>Cancel</button>
                            </form>
                        </div>
                    )}


                    <div className="todo__container">
                        {todo.map((item) => (
                            <div key={item._id} className="todo__card">
                                <div className="todo__details">
                                    <h3 className="todo__name">Title: {item.data.title}</h3>
                                    <p className="todo__description">{item.data.description}</p>
                                    <p className="todo__description">Priority: {item.data.priority}</p>
                                    <button onClick={() => handleDeletion(item._id)}>
                                        Delete
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
