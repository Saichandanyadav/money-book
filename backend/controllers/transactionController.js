const Book = require("../models/Book");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");
const { generateTransactionPdf } = require("../utils/pdfGenerator");

exports.getTransactionOverview = async (req, res) => {
    try {
        const { bookId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ toast: { title: "Invalid ID", description: "The book ID is not valid." } });
        }

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "The specified book does not exist." } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You don't own this book." } });

        const overview = await Transaction.aggregate([
            { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
            {
                $group: {
                    _id: "$status",
                    totalAmount: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const creditData = overview.find(item => item._id === "credit") || { totalAmount: 0, count: 0 };
        const debitData = overview.find(item => item._id === "debit") || { totalAmount: 0, count: 0 };

        const totalCreditAmount = creditData.totalAmount;
        const totalDebitAmount = debitData.totalAmount;
        const creditCount = creditData.count;
        const debitCount = debitData.count;
        const totalTransactionCount = creditCount + debitCount;
        const netTransactionAmount = totalCreditAmount - totalDebitAmount;
        const currentBalance = book.totalAmount;

        res.json({
            totalCreditAmount,
            creditCount,
            totalDebitAmount,
            debitCount,
            totalTransactionCount,
            netTransactionAmount,
            currentBalance
        });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.sendMoney = async (req, res) => {
    try {
        const { bookId, name, amount, description, modeOfPayment } = req.body;
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "The specified book does not exist." } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You don't own this book." } });
        if (amount > book.totalAmount) return res.status(400).json({ toast: { title: "Insufficient funds", description: "Not enough balance in the book." } });

        book.totalAmount -= amount;
        await book.save();

        const transaction = await Transaction.create({
            bookId,
            name,
            status: "debit",
            amount,
            modeOfPayment,
            description,
        });

        res.status(201).json({ transaction, toast: { title: "Money sent", description: "Transaction recorded successfully." } });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.addMoney = async (req, res) => {
    try {
        const { bookId, name, amount, description, modeOfPayment } = req.body;
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "The specified book does not exist." } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You don't own this book." } });

        book.totalAmount += amount;
        await book.save();

        const transaction = await Transaction.create({
            bookId,
            name,
            status: "credit",
            amount,
            modeOfPayment,
            description,
        });

        res.status(201).json({ transaction, toast: { title: "Money added", description: "Transaction recorded successfully." } });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.getTransactionsByBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const modeOfPayment = req.query.modeOfPayment;
        const status = req.query.status;
        const skip = (page - 1) * limit;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "The specified book does not exist." } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You don't own this book." } });

        const filterQuery = { bookId };
        if (modeOfPayment) {
            filterQuery.modeOfPayment = modeOfPayment;
        }
        if (status) {
            filterQuery.status = status;
        }

        const totalTransactions = await Transaction.countDocuments(filterQuery);
        const transactions = await Transaction.find(filterQuery)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            transactions,
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            totalTransactions,
        });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.exportTransactionsPdf = async (req, res) => {
    try {
        const { bookId } = req.params;
        const modeOfPayment = req.query.modeOfPayment;
        const status = req.query.status;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ toast: { title: "Book not found" } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied" } });

        const filterQuery = { bookId: new mongoose.Types.ObjectId(bookId) };
        if (modeOfPayment) filterQuery.modeOfPayment = modeOfPayment;
        if (status) filterQuery.status = status;

        const transactions = await Transaction.find(filterQuery).sort({ createdAt: -1 });

        generateTransactionPdf(res, req.user, book, transactions, { modeOfPayment, status });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};


exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ toast: { title: "Transaction not found", description: "No transaction found with given id." } });

        const book = await Book.findById(transaction.bookId);
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You don't have access to this transaction." } });

        res.json({ transaction });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const { name, amount, modeOfPayment, description } = req.body;
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) return res.status(404).json({ toast: { title: "Transaction not found", description: "No transaction found with given id." } });

        const book = await Book.findById(transaction.bookId);
        if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "No book found for this transaction." } });
        if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You do not own this book." } });

        if (transaction.status === "debit") {
            book.totalAmount += transaction.amount;
            if (amount > book.totalAmount) return res.status(400).json({ toast: { title: "Insufficient funds", description: "Not enough balance for the update." } });
            book.totalAmount -= amount;
        } else {
            book.totalAmount -= transaction.amount;
            book.totalAmount += amount;
        }
        await book.save();

        transaction.name = name;
        transaction.amount = amount;
        transaction.modeOfPayment = modeOfPayment;
        transaction.description = description;
        await transaction.save();

        res.json({ transaction, toast: { title: "Transaction updated", description: "Transaction details updated successfully." } });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};