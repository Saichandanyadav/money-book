const Book = require("../models/Book");
const Transaction = require("../models/Transaction");

exports.createBook = async (req, res) => {
    try {
        const { name, totalAmount, description, initialStatus, initialMode } = req.body;
        const book = await Book.create({
            name,
            totalAmount,
            description,
            isActive: true,
            owner: req.user._id,
            country: req.user.country || "India",
        });

        if (totalAmount > 0) {
            await Transaction.create({
                bookId: book._id,
                name: `${name} [Initial]`,
                status: initialStatus,
                modeOfPayment: initialMode || "Cash",
                amount: totalAmount,
                description: `Initial balance set for "${book.name}" book.`,
            });
        }

        res.status(201).json({ book, toast: { title: "Book created", description: "Your new book was created successfully." } });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find({ owner: req.user._id });
        res.json({ books });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "No book found with given id." } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You do not own this book." } });

        const transactions = await Transaction.find({ bookId: book._id });
        res.json({ book, transactions });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.toggleBookStatus = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "No book found with given id." } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You do not own this book." } });

        book.isActive = !book.isActive;
        await book.save();
        res.json({ book, toast: { title: book.isActive ? "Book activated" : "Book deactivated", description: `Book is now ${book.isActive ? "active" : "deactivated"}.` } });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "No book found with given id." } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You do not own this book." } });

        await Book.findByIdAndDelete(req.params.id);
        await Transaction.deleteMany({ bookId: req.params.id });
        res.json({ message: "Book and transactions deleted successfully", toast: { title: "Deleted", description: "Book and its transactions were deleted." } });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};