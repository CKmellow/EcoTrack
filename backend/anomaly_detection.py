# anomaly_detection.py
from sklearn.ensemble import IsolationForest
import numpy as np
import pandas as pd

class AnomalyDetector:
	def train_and_save_iforest(self, df, model_path):
		"""
		Train Isolation Forest on the provided DataFrame and save the model.
		"""
		features = self.extract_features(df)
		self.isolation_forest.fit(features)
		import joblib
		joblib.dump(self.isolation_forest, model_path)
	def _to_dataframe(self, consumption_data):
		import pandas as pd
		df = pd.DataFrame(consumption_data)
		if 'timestamp' in df.columns:
			df['timestamp'] = pd.to_datetime(df['timestamp'])
		if 'consumption' in df.columns:
			df['consumption'] = pd.to_numeric(df['consumption'])
		return df

	@property
	def isolation_forest(self):
		class Dummy:
			def fit_predict(self, X):
				return [0 for _ in range(len(X))]
		return Dummy()
	def load_kplc_csv(self, file_path, customer_id=None):
		"""
		Load KPLC CSV file and optionally filter by customer_id.
		"""
		df = pd.read_csv(file_path)
		if customer_id is not None and 'CustomerID' in df.columns:
			df = df[df['CustomerID'] == customer_id]
		return df
	def __init__(self, contamination=0.1, random_state=42):
		self.isolation_forest = IsolationForest(
			contamination=contamination,
			random_state=random_state
		)

	def _to_dataframe(self, consumption_data):
		import pandas as pd
		df = pd.DataFrame(consumption_data)
		if 'timestamp' in df.columns:
			df['timestamp'] = pd.to_datetime(df['timestamp'])
		if 'consumption' in df.columns:
			df['consumption'] = pd.to_numeric(df['consumption'])
		return df

	def extract_features(self, df):
		"""
		Feature set: hour_of_day, day_of_week, consumption, rate_of_change
		"""
		hour = df['timestamp'].dt.hour
		dow = df['timestamp'].dt.weekday
		cons = df['consumption']
		roc = cons.diff().fillna(0)
		features = np.c_[hour.values, dow.values, cons.values, roc.values]
		return features

	def detect_consumption_anomalies(self, consumption_data):
		df = self._to_dataframe(consumption_data)
		features = self.extract_features(df)

		preds = self.isolation_forest.fit_predict(features)  # -1 anomaly, 1 normal
		df['is_anomaly_if'] = (preds == -1)
		return df
