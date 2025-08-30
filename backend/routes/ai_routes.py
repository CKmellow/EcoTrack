#ai_service.py
from fastapi import APIRouter, Depends, Request
from backend.services import ai_service, auth_service
from pydantic import BaseModel
import sys
sys.path.append("../../ecotrack-ai/backend")
from backend.anomaly_detection import AnomalyDetector
from backend.carbon_calculator import CarbonFootprintCalculator
from backend.forecasting_service import EnergyForecaster

router = APIRouter(prefix="/ai", tags=["AI"])


class ChatRequest(BaseModel):
    prompt: str

# --- Anomaly Detection Endpoint ---
@router.post("/anomaly-detect")
async def anomaly_detect(request: Request, current_user=Depends(auth_service.get_current_user)):
    data = await request.json()
    detector = AnomalyDetector()
    df = detector._to_dataframe(data["consumption_data"])
    preds = detector.isolation_forest.fit_predict(df[["consumption"]])
    return {"anomalies": preds.tolist()}

# --- Carbon Footprint Calculator Endpoint ---
@router.post("/carbon-calc")
async def carbon_calc(request: Request, current_user=Depends(auth_service.get_current_user)):
    data = await request.json()
    calculator = CarbonFootprintCalculator()
    result = calculator.calculate_carbon_footprint(data["consumption_data"])
    return {"carbon_footprint": result}

# --- Energy Forecasting Endpoint ---
@router.post("/forecast-energy")
async def forecast_energy(request: Request, current_user=Depends(auth_service.get_current_user)):
    data = await request.json()
    forecaster = EnergyForecaster()
    df = forecaster.prepare_data(data["consumption_data"])
    # Example: train Prophet model and forecast next 7 days
    model = forecaster.train_prophet_model(df)
    future = forecaster.make_future_dataframe(df, periods=7)
    forecast = model.predict(future)
    return {"forecast": forecast[["ds", "yhat"]].to_dict("records")}

@router.post("/analyze")
async def analyze(data: dict, current_user=Depends(auth_service.get_current_user)):
    """
    Analyze company data with AI.
    """
    summary = str(data)  # later replace with structured summary
    reply = await ai_service.analyze_energy_data(summary)
    return {"analysis": reply}

@router.post("/report")
async def generate_report(data: dict, current_user=Depends(auth_service.get_current_user)):
    """
    Generate sustainability report.
    """
    summary = str(data)
    reply = await ai_service.generate_sustainability_report(summary)
    return {"report": reply}

@router.post("/chat")
async def chat_with_ai(request: ChatRequest, current_user=Depends(auth_service.get_current_user)):
    """
    Chatbot for sustainability Q&A.
    """
    reply = await ai_service.answer_sustainability_question(request.prompt)
    return {"reply": reply}
