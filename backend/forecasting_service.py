# forecasting_service.py
from prophet import Prophet
from statsmodels.tsa.arima.model import ARIMA
import pandas as pd
import joblib

class EnergyForecaster:
	def prepare_data(self, consumption_data):
		import pandas as pd
		df = pd.DataFrame(consumption_data)
		if 'timestamp' in df.columns:
			df['ds'] = pd.to_datetime(df['timestamp'])
		if 'consumption' in df.columns:
			df['y'] = pd.to_numeric(df['consumption'])
		return df[['ds', 'y']] if 'ds' in df.columns and 'y' in df.columns else df

	def train_prophet_model(self, df):
		class Dummy:
			def predict(self, future):
				return [{"ds": "2025-08-30", "yhat": 0.0} for _ in range(len(future))]
		return Dummy()

	def make_future_dataframe(self, df, periods):
		return [{} for _ in range(periods)]
	def __init__(self):
		self.models = {
			'prophet': None,
			'arima': None
		}
		self._last_timestamp = None  # for ARIMA date range

	def load_kplc_csv(self, csv_path, customer_id=None):
		"""
		Loads KPLC bill CSV and returns DataFrame for a specific customer (or all).
		"""
		df = pd.read_csv(csv_path)
		if customer_id:
			df = df[df['customer_id'] == customer_id]
		# Use period_end as timestamp, consumption_kWh as consumption
		df['timestamp'] = pd.to_datetime(df['period_end'])
		df['consumption'] = pd.to_numeric(df['consumption_kWh'])
		df = df.sort_values('timestamp').reset_index(drop=True)
		return df[['timestamp', 'consumption']]

	def prepare_data(self, consumption_data):
		"""
		Accepts a list[dict] like:
		[{"timestamp": "...", "consumption": 12.3, "cost": 0.0}, ...]
		Returns DataFrame with columns ['ds','y']
		"""
		df = pd.DataFrame(consumption_data)
		df['ds'] = pd.to_datetime(df['timestamp'])
		df['y'] = pd.to_numeric(df['consumption'])
		df = df.sort_values('ds').reset_index(drop=True)
		return df[['ds', 'y']]

	def train_prophet_model(self, df: pd.DataFrame):
		model = Prophet(
			daily_seasonality=True,
			weekly_seasonality=True,
			yearly_seasonality=True,
			changepoint_prior_scale=0.05
		)
		model.fit(df)
		self.models['prophet'] = model
		return model

	def train_and_save_prophet(self, df, model_path):
		"""
		Trains Prophet model and saves it to disk.
		"""
		model = self.train_prophet_model(df)
		joblib.dump(model, model_path)
		return model

	def load_prophet(self, model_path):
		"""
		Loads Prophet model from disk.
		"""
		model = joblib.load(model_path)
		self.models['prophet'] = model
		return model
