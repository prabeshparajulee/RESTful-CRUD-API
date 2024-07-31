const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/bookModel');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes

app.get('/', (req, res) => {
    res.send('Hello users, This is the CRUD Restful API');
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.find({});
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id);
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/books', async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message});
    }
});

// Update a book details
app.put('/books/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findByIdAndUpdate(id, req.body, { new: true });
        // We cannot find any book in database
        if (!book) {
            return res.status(404).json({message: `Cannot find any book with ID ${id}`});
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const book = await Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).json({message: `Cannot find any book with ID ${id}`});
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Database and server connection

mongoose
.connect("mongodb://localhost:27017/crudapp")
.then(() => {
    console.log('Connected to MongoDB database');
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
}).catch((error) => {
    console.log(error);
});
