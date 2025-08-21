## Tech Stack

| Layer       | Technologies |  
|-------------|--------------|  
| Frontend    | React.js(Vite) |  
| Backend     | Node.js, Express.js |  
| Database | MySQL | 
 
---


## Installation and Setup
### 1. Clone the Repository

```bash
git clone https://github.com/securin.git
cd securin
```

### 2. Backend Setup (Express + MySQL)

1. Install dependencies:
```bash
cd backend
npm install
```

2. Update database configuration in `server.js`:
```javascript
const dbConfig = {
  host: 'localhost',
  user: 'your_mysql_username',
  password: 'your_mysql_password',
  database: 'securin'
};
```
### 3. Frontend Setup (React + Vite)

```bash
cd ../frontend
npm install
```

---

## Running the Full Stack Application
### **Start Backend**
```bash
cd backend
node parse.js
node server.js
```
### **Start Frontend**
```bash
cd frontend
npm run dev
```

---
