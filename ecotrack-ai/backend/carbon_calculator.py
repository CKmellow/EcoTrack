# carbon_calculator.py
import pandas as pd

class CarbonFootprintCalculator:
	def calculate_carbon_footprint(self, consumption_data):
		return {"total_emissions": 0.0, "details": consumption_data}
	def __init__(self):
		# Kenya grid factors (example values; adjust when you have official factors)
		self.emission_factors = {
			'grid_average': 0.4308,  # kg CO2 per kWh
			'peak_hours': 0.5200,
			'off_peak': 0.3850
		}
		# Peak: 18:00–23:00 inclusive; Off-peak: 22:00–06:00 wrap-around
		self.peak_hours = set(range(18, 24))  # 18,19,20,21,22,23
		self.off_peak_hours = set(list(range(22, 24)) + list(range(0, 6)))  # 22,23,0..5

	def load_kplc_csv(self, csv_path, customer_id=None):
		"""
		Loads KPLC bill CSV and returns list of dicts for a specific customer (or all).
		"""
		df = pd.read_csv(csv_path)
		if customer_id:
			df = df[df['customer_id'] == customer_id]
		df['timestamp'] = pd.to_datetime(df['period_end'])
		df['consumption'] = pd.to_numeric(df['consumption_kWh'])
		df = df.sort_values('timestamp').reset_index(drop=True)
		return df[['timestamp', 'consumption']].to_dict('records')

	def calculate_carbon_footprint(self, consumption_data):
		"""
		consumption_data: list[dict] with keys timestamp(str/datetime), consumption(kWh)
		"""
		total_emissions = 0.0
		total_consumption = 0.0
		hourly_breakdown = []

		for rec in consumption_data:
			ts = pd.to_datetime(rec['timestamp'])
			hour = int(ts.hour)
			consumption = float(rec['consumption'])

			if hour in self.peak_hours:
				ef = self.emission_factors['peak_hours']
				period = 'peak'
			elif hour in self.off_peak_hours:
				ef = self.emission_factors['off_peak']
				period = 'off_peak'
			else:
				ef = self.emission_factors['grid_average']
				period = 'standard'

			emissions = consumption * ef
			total_emissions += emissions
			total_consumption += consumption
			hourly_breakdown.append({
				'timestamp': rec['timestamp'],
				'consumption': consumption,
				'emissions': emissions,
				'period': period
			})
		return {
			'total_emissions': total_emissions,
			'total_consumption': total_consumption,
			'hourly_breakdown': hourly_breakdown
		}
