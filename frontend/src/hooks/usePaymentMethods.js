import { useState, useEffect, useCallback } from "react";
import api from "../api/api";

const usePaymentMethods = () => {
    const [paymentMethods, setPaymentMethods] = useState([]);
    
    const fetchPaymentMethods = useCallback(async () => {
        try {
            const res = await api.get("/payment-methods");
            setPaymentMethods(res.data.paymentMethods.map(m => m.name));
        } catch (error) {
            setPaymentMethods([]);
        }
    }, []);

    useEffect(() => {
        fetchPaymentMethods();
    }, [fetchPaymentMethods]);

    const addPaymentMethod = async (name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return null;

        try {
            const res = await api.post("/payment-methods", { name: trimmedName });
            const newMethodName = res.data.paymentMethod.name;
            setPaymentMethods(prev => {
                if (!prev.map(p => p.toLowerCase()).includes(newMethodName.toLowerCase())) {
                    return [...prev, newMethodName];
                }
                return prev.map(p => p.toLowerCase()).includes(newMethodName.toLowerCase()) ? prev.map(p => p.toLowerCase()).includes(newMethodName.toLowerCase()) ? prev.map(p => p.toLowerCase() === newMethodName.toLowerCase() ? newMethodName : p) : [...prev, newMethodName] : prev;
            });
            return newMethodName;
        } catch (error) {
            return null;
        }
    };

    return { paymentMethods, fetchPaymentMethods, addPaymentMethod };
};

export default usePaymentMethods;