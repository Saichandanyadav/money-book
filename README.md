# Money Book - (Book Management System)

The Money Book is a simple and easy-to-use tool to manage your money and transactions.  
You can create books, track money coming in (credit) and going out (debit), and see visual stats.  
It is fully responsive, so you can use it on desktop, tablet, or mobile.  
This project is perfect for personal finance or small business bookkeeping.  
You can also export your transactions in PDF format for record-keeping or sharing.

<img width="1024" height="1024" alt="AppLogo1" src="https://github.com/user-attachments/assets/08c88a90-8d57-46a2-b01f-f0370af4f056" />

---

## Live Links & Repository

- **Frontend (Vercel):** [https://chandan-cash-calculator.vercel.app/](https://chandan-cash-calculator.vercel.app/)  
- **Extra Domain (Vercel):** [https://chandan-money-book.vercel.app/](https://chandan-money-book.vercel.app/)  
- **Backend (Render):** [https://chandan-cash-calculator.onrender.com/](https://chandan-cash-calculator.onrender.com/)  
- **GitHub Repository:** [https://github.com/Saichandanyadav/money-book](https://github.com/Saichandanyadav/money-book)  

---

## How It Works (Step by Step)

1. **Create a Book**  
   - A book is like a personal or business account.  
   - You can add a name, total amount, and optional description.  

2. **Add Money (Credit) or Send Money (Debit)**  
   - Credit: Add money to the book.  
   - Debit: Send money from the book.  
   - Each transaction can have a payment mode (Cash, GPay, PhonePe, Paytm, or Account Transfer) and description.  

3. **Activate or Deactivate a Book**  
   - Active books can receive or send money.  
   - Deactivated books cannot process transactions.  

4. **Delete a Book**  
   - Permanently remove the book and all its transactions.  

5. **View Stats**  
   - See your money visually with Pie, Bar, and Line charts.  
   - Pie chart: Shows debit vs credit.  
   - Bar chart: Shows totals by payment mode.  
   - Line chart: Shows balance changes over time.  

6. **Export Transactions**  
   - Export all your transactions in PDF format for offline records or sharing.

---

## Workflow Diagram

<img width="1536" height="1024" alt="flow-diagram" src="https://github.com/user-attachments/assets/846dcc84-7083-4f36-97fc-b355d8485154" />
 
*Visual representation: create a book → add/send transactions → view stats → export transactions.*

---

## Project Structure

```

root/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── flow-diagram.png
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md

````

---

## How to Run the Project

### Backend
```bash
cd backend
npm install
````

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`.

---

## Features

* Signup/Login for secure access
* Create, activate, deactivate, and delete books
* Add or send money with multiple payment modes
* Filter transactions by date or payment mode
* Visual stats for better money management
* Export transactions in PDF format
* Fully responsive design

---

## Technologies Used

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, dotenv
**Frontend:** React.js, React Router DOM, Axios, Tailwind CSS, Recharts

---

## License

MIT License

---

## Developer

**Sai Chandan Gundaboina**

* GitHub: [https://github.com/Saichandanyadav](https://github.com/Saichandanyadav)
* LinkedIn: [https://www.linkedin.com/in/saichandanyadav/](https://www.linkedin.com/in/saichandanyadav/)
* Email: [saichandhanyadav2002@gmail.com](mailto:saichandhanyadav2002@gmail.com)
  
