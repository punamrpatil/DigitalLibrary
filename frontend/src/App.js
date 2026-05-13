import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [books, setBooks] = useState([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('Fiction');
    const [copies, setCopies] = useState(5);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    const API_URL = 'http://localhost:8080/api/books';

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            setBooks(data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const addBook = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, author, category, totalCopies: parseInt(copies) })
            });
            const newBook = await res.json();
            setBooks([...books, newBook]);
            setTitle('');
            setAuthor('');
            setCopies(5);
            setShowForm(false);
            alert('? Book added!');
        } catch (err) {
            alert('? Error adding book');
        }
    };

    const deleteBook = async (id) => {
        if (window.confirm('Delete this book?')) {
            try {
                await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
                setBooks(books.filter(b => b.id !== id));
                alert('? Book deleted!');
            } catch (err) {
                alert('? Error deleting book');
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-5"><h2>Loading Digital Library...</h2></div>;
    }

    return (
        <div className="container mt-4">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h1 className="text-center mb-0">?? Digital Library</h1>
                </div>
                <div className="card-body">
                    {/* Stats */}
                    <div className="row mb-4">
                        <div className="col-md-4">
                            <div className="alert alert-info text-center">
                                <h4>?? {books.length}</h4>
                                <p>Total Books</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="alert alert-success text-center">
                                <h4>?? {books.reduce((sum, b) => sum + (b.availableCopies || 0), 0)}</h4>
                                <p>Available Copies</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="alert alert-warning text-center">
                                <button className="btn btn-success w-100" onClick={() => setShowForm(!showForm)}>
                                    {showForm ? '? Cancel' : '? Add New Book'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Add Book Form */}
                    {showForm && (
                        <div className="card mb-4 bg-light">
                            <div className="card-body">
                                <h4>Add New Book</h4>
                                <form onSubmit={addBook}>
                                    <div className="row">
                                        <div className="col-md-4 mb-2">
                                            <input type="text" className="form-control" placeholder="Title" 
                                                value={title} onChange={e => setTitle(e.target.value)} required />
                                        </div>
                                        <div className="col-md-3 mb-2">
                                            <input type="text" className="form-control" placeholder="Author" 
                                                value={author} onChange={e => setAuthor(e.target.value)} required />
                                        </div>
                                        <div className="col-md-3 mb-2">
                                            <select className="form-control" value={category} onChange={e => setCategory(e.target.value)}>
                                                <option>Fiction</option><option>Technology</option>
                                                <option>Science</option><option>History</option>
                                                <option>Programming</option>
                                            </select>
                                        </div>
                                        <div className="col-md-1 mb-2">
                                            <input type="number" className="form-control" placeholder="Copies" 
                                                value={copies} onChange={e => setCopies(e.target.value)} />
                                        </div>
                                        <div className="col-md-1 mb-2">
                                            <button type="submit" className="btn btn-primary w-100">Add</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Books Grid */}
                    <div className="row">
                        {books.length === 0 ? (
                            <div className="alert alert-info">No books yet. Add your first book!</div>
                        ) : (
                            books.map(book => (
                                <div key={book.id} className="col-md-4 mb-3">
                                    <div className="card h-100 shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title">{book.title}</h5>
                                            <h6 className="card-subtitle mb-2 text-muted">by {book.author}</h6>
                                            <p className="card-text">
                                                <span className="badge bg-secondary">{book.category}</span><br/>
                                                <small>ISBN: {book.isbn || 'N/A'}</small><br/>
                                                <strong>Available: {book.availableCopies || 0}/{book.totalCopies || 0} copies</strong>
                                            </p>
                                            <button className="btn btn-danger btn-sm" onClick={() => deleteBook(book.id)}>
                                                ??? Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
