const PaymentMethod = require("../models/PaymentMethod");

exports.getPaymentMethods = async (req, res) => {
    try {
        const defaultMethods = [
            { name: "Cash" },
            { name: "Account Transfer" },
            { name: "PhonePe" },
            { name: "GPay" },
            { name: "Paytm" },
            { name: "Opening Balance" }
        ];
        const customMethods = await PaymentMethod.find({ owner: req.user._id });

        const allMethods = [...defaultMethods.map(m => m.name), ...customMethods.map(m => m.name)].filter((method, index, self) =>
            index === self.findIndex((m) => m.toLowerCase() === method.toLowerCase())
        );

        res.json({ paymentMethods: allMethods.map(name => ({ name })) });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};

exports.addPaymentMethod = async (req, res) => {
    try {
        const { name } = req.body;
        const trimmedName = name.trim();
        const normalizedInput = trimmedName.toLowerCase();

        const defaultMethods = ["Cash", "Account Transfer", "PhonePe", "GPay", "Paytm", "Opening Balance"];
        const existingDefault = defaultMethods.find(m => m.toLowerCase() === normalizedInput);

        if (existingDefault) {
            return res.status(200).json({ paymentMethod: { name: existingDefault }, toast: { title: "Exists", description: "Default payment method used." } });
        }

        const existingCustom = await PaymentMethod.findOne({ normalizedName: normalizedInput, owner: req.user._id });

        if (existingCustom) {
            return res.status(200).json({ paymentMethod: { name: existingCustom.name }, toast: { title: "Already exists", description: "This payment method is already saved." } });
        }

        const newMethod = await PaymentMethod.create({
            name: trimmedName,
            normalizedName: normalizedInput,
            owner: req.user._id
        });

        res.status(201).json({ paymentMethod: newMethod, toast: { title: "Added", description: "New payment method added." } });
    } catch (error) {
        res.status(500).json({ toast: { title: "Server error", description: error.message } });
    }
};