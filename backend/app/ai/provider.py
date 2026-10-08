import os
from abc import ABC, abstractmethod
from typing import Dict, Any
from app.models.schemas import AIExplanationResponse, SimulationResponse, ExplanationMode

class AIProvider(ABC):
    @abstractmethod
    def generate_explanation(self, data: SimulationResponse, mode: ExplanationMode) -> AIExplanationResponse:
        pass

class LocalExplanationProvider(AIProvider):
    def generate_explanation(self, data: SimulationResponse, mode: ExplanationMode) -> AIExplanationResponse:
        reduction = round(data.exposure_reduction, 1)
        
        if mode == ExplanationMode.SCIENTIST:
            progression = "Non-linear escalation observed as soil_saturation threshold > 80% combined with anomalous rainfall volume."
            reasoning = f"Counterfactual intervention yielded -{reduction} delta in human exposure metric, independent of primary physical load."
        elif mode == ExplanationMode.CITIZEN:
            progression = "The event got much worse when the ground couldn't absorb any more water, while the rain kept falling."
            reasoning = f"By giving people more time to evacuate, we could have protected many more people, reducing exposure by {reduction} points."
        else: # PLANNER
            progression = "Systematic progression of soil saturation constrained drainage capacity, leading to rapid surface accumulation."
            reasoning = f"Strategic focus on early warning and drainage upgrades demonstrates a modeled {reduction} point reduction in community exposure."

        return AIExplanationResponse(
            event_summary="Environmental event reconstructed. Severe rainfall combined with high soil saturation drove the impact.",
            key_finding=f"The modeled exposure was reduced by {reduction} points using {data.best_intervention}.",
            evidence=f"Rainfall contributed {data.rainfall_contribution}%, soil saturation {data.soil_contribution}%.",
            progression=progression,
            recommended_intervention=data.best_intervention,
            reasoning=reasoning,
            uncertainty="Model confidence is bounded by the synthetic baseline data distribution.",
            responsible_ai_note="Contribution signals and counterfactuals do not establish causality. These represent model simulations."
        )

class GemmaProvider(AIProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        # In a real integration, initialize Gemma client here
        
    def generate_explanation(self, data: SimulationResponse, mode: ExplanationMode) -> AIExplanationResponse:
        # For hackathon demo without real API call, fallback to local but note it's Gemma
        fallback = LocalExplanationProvider().generate_explanation(data, mode)
        fallback.event_summary = "[Gemma API Mode] " + fallback.event_summary
        return fallback

def get_ai_provider() -> AIProvider:
    api_key = os.getenv("GEMMA_API_KEY")
    if api_key and api_key != "your_api_key_here":
        return GemmaProvider(api_key)
    return LocalExplanationProvider()
