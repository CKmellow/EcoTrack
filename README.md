# EcoTrack

**EcoTrack** is an AI-powered platform designed to help organizations monitor, forecast, and reduce energy consumption and carbon emissions. By leveraging machine learning models, anomaly detection, and predictive analytics, EcoTrack provides actionable insights that allow businesses to optimize energy usage, cut costs, and contribute to environmental sustainability.

---

## Project Overview

EcoTrack addresses the critical challenge of energy inefficiency and climate impact in organizations. It collects energy consumption data, calculates carbon emissions, detects anomalies, forecasts future energy usage, and provides recommendations for reducing environmental impact. The system is built for scalability, enabling integration with different data sources and extending AI capabilities over time.

---

## Key Features

### 1. Carbon Emissions Calculator
- Calculates organizational carbon footprint based on electricity, fuel, and operational data.
- Converts energy usage into CO₂ emissions using standard conversion factors.
- Generates reports and historical data trends.

### 2. Energy Forecasting
- Predicts future energy consumption using machine learning models such as **ARIMA** and **Prophet**.
- Supports planning for energy optimization and cost reduction.
- Visualizes predicted vs. actual consumption to track improvements.

### 3. Anomaly Detection
- Uses models like **Isolation Forest** to detect unusual energy usage patterns.
- Alerts organizations to prevent energy wastage or operational inefficiencies.
- Highlights high-impact areas for potential savings.

### 4. AI Recommendations
- Provides actionable suggestions for reducing energy usage and emissions.
- Identifies equipment or operational patterns causing inefficiencies.
- Supports decision-making for sustainability strategies.

### 5. Interactive Visualizations
- Visual dashboards with graphs and charts showing energy consumption, forecasts, and anomalies.
- Enables users to explore historical data and trends interactively.

### 6. Modular and Extensible Architecture
- Backend built with **FastAPI**, enabling easy integration of new services and endpoints.
- Separate modules for AI models, anomaly detection, forecasting, and carbon calculations.
- Ready for future enhancements like multi-company support or additional energy metrics.

---

## Tech Stack

- **Backend:** Python, FastAPI, Uvicorn  
- **Database:** MongoDB Atlas (NoSQL, cloud-hosted)  
- **AI/ML:** scikit-learn, pandas, numpy, Prophet, statsmodels  
- **Frontend:** React.js for dashboards and interactive visualizations  
- **Environment Management:** Python virtual environments (`venv`)  