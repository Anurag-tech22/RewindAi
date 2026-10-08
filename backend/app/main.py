from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class EventState(BaseModel):
    timestamp: str
    impact: float
    description: str

class SimulationParams(BaseModel):
    drainage_capacity: float
    vegetation: float
    warning_time: float

@app.get("/api/event/timeline")
def get_timeline():
    # Simulate a flood event developing over 48 hours
    return [
        {"timestamp": "T-48h", "impact": 12.0, "description": "Heavy rainfall begins. Soil saturation normal."},
        {"timestamp": "T-36h", "impact": 28.5, "description": "Rainfall intensifies. Localized pooling in low-lying areas."},
        {"timestamp": "T-24h", "impact": 45.2, "description": "Drainage systems reaching capacity. Soil saturated."},
        {"timestamp": "T-12h", "impact": 72.8, "description": "River banks breach. Major infrastructure threatened."},
        {"timestamp": "T-0h",  "impact": 87.4, "description": "Peak flood stage. Severe physical and human impact."}
    ]

@app.post("/api/simulate")
def simulate_intervention(params: SimulationParams) -> dict:
    # Base real-world impact was 87.4%
    base_impact = 87.4
    
    # Calculate physical impact reduction
    # More drainage = less water pooling
    # More vegetation = slower water runoff
    drainage_factor = 1.0 - (params.drainage_capacity / 100.0) * 0.4
    vegetation_factor = 1.0 - (params.vegetation / 100.0) * 0.3
    
    physical_impact = base_impact * drainage_factor * vegetation_factor
    
    # Calculate human exposure reduction
    # Warning time heavily reduces human exposure, even if physical impact is high
    warning_factor = 1.0 - (params.warning_time / 100.0) * 0.6
    
    human_exposure = physical_impact * warning_factor
    exposure_reduction = base_impact - human_exposure

    return {
        "physical_impact": max(0, min(100, physical_impact)),
        "human_exposure": max(0, min(100, human_exposure)),
        "exposure_reduction": max(0, min(100, exposure_reduction))
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
