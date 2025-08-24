# test_complete_setup.py
"""
Complete test script for EcoTrack AI system
Tests all installed libraries and your existing AI algorithms
"""

import sys
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import warnings
warnings.filterwarnings('ignore')  # Suppress minor warnings for cleaner output

# Import model classes
from backend.forecasting_service import EnergyForecaster
from backend.anomaly_detection import AnomalyDetector
from backend.carbon_calculator import CarbonFootprintCalculator

def test_basic_imports():
	"""Test that all essential libraries are properly installed"""
	print("🔍 Testing Basic Library Imports...")
	try:
		import pandas as pd
		import numpy as np
		import sklearn
		import fastapi
		import uvicorn
		import requests
		import matplotlib.pyplot as plt
		print("  ✅ Core libraries: pandas, numpy, scikit-learn, fastapi, matplotlib")
		import prophet
		import statsmodels
		print("  ✅ Time series libraries: prophet, statsmodels")
		import plotly
		import openpyxl
		print("  ✅ Visualization and data libraries: plotly, openpyxl")
		print(f"  📊 Library versions:")
		print(f"    - pandas: {pd.__version__}")
		print(f"    - numpy: {np.__version__}")
		print(f"    - scikit-learn: {sklearn.__version__}")
		return True
	except ImportError as e:
		print(f"  ❌ Import error: {e}")
		return False

def test_scikit_learn_functionality():
	"""Test scikit-learn functionality using AnomalyDetector class"""
	print("\n🤖 Testing Scikit-learn Functionality...")
	try:
		# Create sample energy data
		np.random.seed(42)
		n_samples = 1000
		consumption_data = []
		for i in range(n_samples):
			consumption_data.append({
				'timestamp': (datetime(2023, 1, 1) + timedelta(hours=i)).strftime('%Y-%m-%d %H:%M:%S'),
				'consumption': float(np.random.uniform(500, 5000))
			})
		# Use AnomalyDetector
		detector = AnomalyDetector()
		result_df = detector.detect_consumption_anomalies(consumption_data)
		anomalies_count = result_df['is_anomaly_if'].sum()
		print(f"  ✅ Isolation Forest Anomaly Detection")
		print(f"    - Anomalies detected: {anomalies_count}/{len(result_df)} samples")
		return True
	except Exception as e:
		print(f"  ❌ Scikit-learn test failed: {e}")
		return False

def test_prophet_functionality():
	"""Test Prophet forecasting using EnergyForecaster class"""
	print("\n🔮 Testing Prophet Time Series Forecasting...")
	try:
		# Create sample time series data
		dates = pd.date_range('2023-01-01', '2024-08-01', freq='D')
		consumption = np.maximum(
			np.linspace(1000, 1200, len(dates)) +
			100 * np.sin(2 * np.pi * np.arange(len(dates)) / 365) +
			50 * np.sin(2 * np.pi * np.arange(len(dates)) / 7) +
			np.random.normal(0, 50, len(dates)),
			100
		)
		consumption_data = [
			{'timestamp': d.strftime('%Y-%m-%d'), 'consumption': float(c)}
			for d, c in zip(dates, consumption)
		]
		forecaster = EnergyForecaster()
		df = forecaster.prepare_data(consumption_data)
		model = forecaster.train_prophet_model(df)
		future = model.make_future_dataframe(periods=7, freq='D')
		forecast = model.predict(future)
		print(f"  ✅ Prophet model trained and forecast generated for next 7 days.")
		print(f"    - Last forecasted values:")
		print(forecast[['ds','yhat']].tail(3))
		return True
	except Exception as e:
		print(f"  ❌ Prophet test failed: {e}")
		return False
