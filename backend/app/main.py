from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from app.models.schemas import InterventionRequest, SimulationResponse, AIExplanationRequest, AIExplanationResponse, ExplanationMode, EventState
from app.models.impact_model import BaselineImpactModel
from app.ai.provider import get_ai_provider

app = FastAPI(title="RewindAI Backend", version="1.1.0")

# SECURITY: CORS restricted (in production this would be specific origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# SECURITY: Simple Rate Limit Abstraction (In-memory dict for demo, Redis in prod)
RATE_LIMITS = {}

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    # Increment logic omitted for brevity, abstract only
    response = await call_next(request)
    return response

model = BaselineImpactModel()
ai_provider = get_ai_provider()

# Synthetic timeline data
TIMELINE_DATA = [
    {"time_label": "T-48h", "rainfall": 5, "soil_saturation": 40, "drainage_load": 20, "vegetation": 60, "visibility": 100},
    {"time_label": "T-36h", "rainfall": 15, "soil_saturation": 55, "drainage_load": 30, "vegetation": 55, "visibility": 80},
    {"time_label": "T-24h", "rainfall": 45, "soil_saturation": 70, "drainage_load": 50, "vegetation": 50, "visibility": 40},
    {"time_label": "T-12h", "rainfall": 80, "soil_saturation": 85, "drainage_load": 85, "vegetation": 45, "visibility": 20},
    {"time_label": "T-6h", "rainfall": 95, "soil_saturation": 95, "drainage_load": 98, "vegetation": 40, "visibility": 10},
    {"time_label": "T-2h", "rainfall": 100, "soil_saturation": 98, "drainage_load": 100, "vegetation": 35, "visibility": 5},
    {"time_label": "NOW", "rainfall": 100, "soil_saturation": 100, "drainage_load": 100, "vegetation": 35, "visibility": 5},
]

@app.get("/api/event/timeline")
def get_timeline():
    results = []
    for point in TIMELINE_DATA:
        # Validate data
        state = EventState(**point)
        impact = model.calculate_impact(state.model_dump())
        signals = model.get_contribution_signals(state.model_dump())
        results.append({**state.model_dump(), "impact": impact, "signals": signals})
    return results

@app.post("/api/simulate", response_model=SimulationResponse)
def simulate_intervention(req: InterventionRequest):
    # Use the NOW state for simulation
    base_state = TIMELINE_DATA[-1]
    
    # Original
    original_impact = model.calculate_impact(base_state)
    original_exposure = model.calculate_human_exposure(original_impact, 0)
    
    # Counterfactual
    rewound_state = base_state.copy()
    rewound_state['drainage_load'] = max(0, rewound_state['drainage_load'] - req.drainage_capacity)
    rewound_state['vegetation'] = min(100, rewound_state['vegetation'] + req.vegetation)
    
    rewound_impact = model.calculate_impact(rewound_state)
    rewound_exposure = model.calculate_human_exposure(rewound_impact, req.warning_time)
    
    signals = model.get_contribution_signals(base_state)
    
    return SimulationResponse(
        physical_impact=round(rewound_impact, 1),
        human_exposure=round(rewound_exposure, 1),
        rainfall_contribution=signals["rainfall_accumulation"],
        soil_contribution=signals["soil_saturation"],
        drainage_contribution=signals["drainage_overload"],
        exposure_reduction=round(original_exposure - rewound_exposure, 1),
        best_intervention="Combined intervention" if req.warning_time > 0 and req.drainage_capacity > 0 else "Single intervention"
    )

@app.post("/api/ai/explanation", response_model=AIExplanationResponse)
def get_ai_explanation(req: AIExplanationRequest):
    return ai_provider.generate_explanation(req.simulation_results, req.mode)
