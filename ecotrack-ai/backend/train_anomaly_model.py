from backend.anomaly_detection import AnomalyDetector
import glob
import os
import pandas as pd

MODEL_PATH = 'backend/iforest_model_ALL.joblib'
CUSTOMER_ID = None  # Set to None to use all customers, or specify one

def main():
	detector = AnomalyDetector()
	# Find all CSV files in backend/
	csv_files = glob.glob(os.path.join('backend', '*.csv'))
	all_dfs = []
	for csv_path in csv_files:
		try:
			df = detector.load_kplc_csv(csv_path, customer_id=CUSTOMER_ID)
			all_dfs.append(df)
		except KeyError as e:
			print(f"Skipping {csv_path}: missing column {e}")
	if not all_dfs:
		print("No CSV files found for training.")
		return
	combined_df = pd.concat(all_dfs, ignore_index=True)
	detector.train_and_save_iforest(combined_df, MODEL_PATH)
	print(f"Isolation Forest model trained on {len(combined_df)} records and saved to {MODEL_PATH}")

if __name__ == "__main__":
	main()
