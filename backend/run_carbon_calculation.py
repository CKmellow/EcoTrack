from backend.carbon_calculator import CarbonFootprintCalculator
import glob
import os
import pandas as pd

CUSTOMER_ID = None  # Set to None to use all customers, or specify one

def main():
	calculator = CarbonFootprintCalculator()
	# Find all CSV files in backend/
	csv_files = glob.glob(os.path.join('backend', '*.csv'))
	all_records = []
	for csv_path in csv_files:
		try:
			records = calculator.load_kplc_csv(csv_path, customer_id=CUSTOMER_ID)
			all_records.extend(records)
		except KeyError as e:
			print(f"Skipping {csv_path}: missing column {e}")
	if not all_records:
		print("No CSV files found for carbon calculation.")
		return
	result = calculator.calculate_carbon_footprint(all_records)
	print(f"Total Emissions: {result['total_emissions']:.2f} kg CO2")
	print(f"Total Consumption: {result['total_consumption']:.2f} kWh")
	print("Hourly Breakdown (first 5 records):")
	for rec in result['hourly_breakdown'][:5]:
		print(rec)

if __name__ == "__main__":
	main()
