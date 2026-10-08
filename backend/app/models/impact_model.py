from abc import ABC, abstractmethod
from typing import Dict, Any

class ImpactModel(ABC):
    @abstractmethod
    def calculate_impact(self, state: Dict[str, float]) -> float:
        pass
    
    @abstractmethod
    def calculate_human_exposure(self, physical_impact: float, warning_time: float) -> float:
        pass
        
    @abstractmethod
    def get_contribution_signals(self, state: Dict[str, float]) -> Dict[str, float]:
        pass

class BaselineImpactModel(ImpactModel):
    """
    Transparent baseline model using weighted features.
    Documented Formula:
    Physical Impact = (Rainfall * 0.45) + (Soil Saturation * 0.30) + (Drainage Load * 0.20) - (Vegetation * 0.15)
    """
    
    def calculate_impact(self, state: Dict[str, float]) -> float:
        rainfall = state.get("rainfall", 0)
        soil = state.get("soil_saturation", 0)
        drainage = state.get("drainage_load", 0)
        vegetation = state.get("vegetation", 0)
        
        # Base impact
        impact = (rainfall * 0.45) + (soil * 0.30) + (drainage * 0.20) - (vegetation * 0.15)
        # Cap between 0 and 100
        return max(0.0, min(100.0, impact))

    def calculate_human_exposure(self, physical_impact: float, warning_time: float) -> float:
        """
        IMPORTANT LOGIC: Increasing warning time must reduce HUMAN EXPOSURE but must NOT reduce PHYSICAL IMPACT.
        Every hour of warning reduces exposure by roughly 2%.
        """
        reduction = warning_time * 2.0
        exposure = physical_impact - reduction
        return max(0.0, min(100.0, exposure))

    def get_contribution_signals(self, state: Dict[str, float]) -> Dict[str, float]:
        # Returns normalized contribution signals (fake but deterministic for baseline)
        return {
            "rainfall_accumulation": 41.0,
            "soil_saturation": 27.0,
            "drainage_overload": 19.0,
            "land_cover_absorption": 8.0,
            "visibility": 5.0
        }
