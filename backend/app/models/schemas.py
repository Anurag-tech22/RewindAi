from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from enum import Enum

class ExplanationMode(str, Enum):
    SCIENTIST = "SCIENTIST"
    PLANNER = "PLANNER"
    CITIZEN = "CITIZEN"

class EventState(BaseModel):
    time_label: str
    rainfall: float = Field(..., ge=0, le=100)
    soil_saturation: float = Field(..., ge=0, le=100)
    drainage_load: float = Field(..., ge=0, le=100)
    vegetation: float = Field(..., ge=0, le=100)
    visibility: float = Field(..., ge=0, le=100)
    impact: Optional[float] = Field(None, ge=0, le=100)

class InterventionRequest(BaseModel):
    drainage_capacity: float = Field(..., ge=0, le=100, description="Percentage improvement in drainage")
    vegetation: float = Field(..., ge=0, le=100, description="Percentage improvement in vegetation/permeability")
    warning_time: float = Field(..., ge=0, le=48, description="Earlier warning time in hours")

class SimulationResponse(BaseModel):
    physical_impact: float = Field(..., ge=0, le=100)
    human_exposure: float = Field(..., ge=0, le=100)
    rainfall_contribution: float = Field(..., ge=0, le=100)
    soil_contribution: float = Field(..., ge=0, le=100)
    drainage_contribution: float = Field(..., ge=0, le=100)
    exposure_reduction: float = Field(..., ge=0, le=100)
    best_intervention: str

class AIExplanationRequest(BaseModel):
    simulation_results: SimulationResponse
    mode: ExplanationMode = ExplanationMode.PLANNER

class AIExplanationResponse(BaseModel):
    event_summary: str
    key_finding: str
    evidence: str
    progression: str
    recommended_intervention: str
    reasoning: str
    uncertainty: str
    responsible_ai_note: str = "Contribution signals and counterfactuals do not establish causality. These represent model simulations."
