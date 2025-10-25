const Book = require("../models/Book");
const Transaction = require("../models/Transaction");

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
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ toast: { title: "Book not found", description: "The specified book does not exist." } });
    if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You don't own this book." } });

    const transactions = await Transaction.find({ bookId: req.params.bookId });
    res.json({ transactions });
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
    if (!book.owner.equals(req.user._id)) return res.status(403).json({ toast: { title: "Access denied", description: "You don't own this book." } });

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