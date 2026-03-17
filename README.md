# Smart Dashboard

A full-stack web application designed for continuously monitoring production metrics. It features interactive data visualization, real-time backend data serving, and an innovative, draggable webcam component powered by gesture control.

## 📁 Project Structure

The project is structured into three main directories, each serving a distinct purpose:

```text
smart-dashboard/
├── backend/            # Node.js REST API server serving mock production data
├── dataset_generator/  # Python script to generate mock data in CSV format
├── frontend/           # React application with Vite, rendering the dashboard UI
└── README.md           # Project documentation (this file)
```

## 🛠️ Technologies Used & Specific Applications

### 1. Frontend
- **React (v19.x)**: The core library used to build reusable UI components and manage the complex state of the dashboard.
- **Vite**: A modern frontend build tool providing an extremely fast development server and hot module replacement (HMR).
- **Tailwind CSS (v4)**: A utility-first CSS framework utilized for crafting a modern, responsive, and aesthetically pleasing "Industrial Modern" design directly via class names without writing custom CSS files.
- **Chart.js & react-chartjs-2**: Applied to render dynamic and interactive line/bar charts (`ProductionChart.jsx`) that visualize key production metrics such as Output, Defects, and Machine Temperature.
- **MediaPipe (@mediapipe/hands, @mediapipe/camera_utils)**: Integrated into the `GestureControl.jsx` component to enable real-time hand-tracking capabilities via the device's webcam. This is used to implement gesture-based interactions within the dashboard.
- **react-draggable**: Wraps the webcam component, allowing users to freely drag and position the camera feed anywhere on the screen for maximum flexibility.
- **Lucide React**: Provides beautiful, scalable SVG icons used throughout the dashboard interface (e.g., navigation icons, status indicators).
- **Axios**: Used to make HTTP requests from the frontend to fetch data from the backend APIs.

### 2. Backend
- **Node.js & Express**: The runtime environment and web framework used to construct the backend RESTful API. It acts as the bridge connecting the stored data to the frontend client.
- **csv-parser**: An efficient streaming CSV parser used to read the generated `production_data.csv` file, converting rows into JSON objects dynamically when the frontend requests the data.
- **CORS**: Middleware applied to the Express server to handle Cross-Origin Resource Sharing, ensuring the Vite frontend (running on a different port) can successfully access the backend APIs.

### 3. Data Generator (`dataset_generator`)
- **Python (Pandas & NumPy)**: Used within `generate_data.py` to programmatically generate highly realistic dummy production data. It simulates timestamps, machines, outputs, defects, temperatures, and computes overall machine status (Running, Warning, Error) using logical rules. The final output is exported as a CSV file to the `backend/data` directory.

---

## 🚀 How to Run the Code Locally

To get the application fully functional on your local machine, follow these steps sequentially:

### Step 1: Generate Mock Data (Optional, but recommended if no data exists)

1. Open a terminal and navigate to the `dataset_generator` folder:
   ```bash
   cd dataset_generator
   ```
2. (Recommended) Create and activate a Virtual Environment:
   ```bash
   # On Windows
   python -m venv venv
   .\venv\Scripts\activate
   ```
3. Install required Python packages:
   ```bash
   pip install pandas numpy
   ```
4. Run the generation script:
   ```bash
   python generate_data.py
   ```
   *This randomly generates 500 records and successfully saves `production_data.csv` straight into the `backend/data/` folder.*

### Step 2: Start the Backend Server

1. Open a new terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node server.js
   ```
   *The server will typically start running on **`http://localhost:5000`**.*

### Step 3: Start the Frontend Application

1. Open another new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Fire up the Vite development server:
   ```bash
   npm run dev
   ```
   *Vite will provide a local URL (usually **`http://localhost:5173`**). Open this link in your browser to view and interact with the Smart Dashboard!*
