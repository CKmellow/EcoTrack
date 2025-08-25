from backend.forecasting_service import EnergyForecaster
import glob
import os
import sys
import pandas as pd

MODEL_PATH = 'backend/prophet_model_ALL.joblib'
CUSTOMER_ID = None  # Set to None to use all customers, or specify one

def main():
	forecaster = EnergyForecaster()
	# Find all CSV files in the parent ecotrack-ai directory
	parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	csv_files = glob.glob(os.path.join(parent_dir, '*.csv'))
	all_dfs = []
	for csv_path in csv_files:
		try:
			df = forecaster.load_kplc_csv(csv_path, customer_id=CUSTOMER_ID)
			all_dfs.append(df)
		except KeyError as e:
			print(f"Skipping {csv_path}: missing column {e}")
	if not all_dfs:
		print("No CSV files found for training.")
		return
	combined_df = pd.concat(all_dfs, ignore_index=True)
	prepared_df = forecaster.prepare_data(combined_df.to_dict('records'))
	forecaster.train_and_save_prophet(prepared_df, MODEL_PATH)
	print(f"Model trained on {len(combined_df)} records and saved to {MODEL_PATH}")

if __name__ == "__main__":
	main()
