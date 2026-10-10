from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_timeline_endpoint():
    response = client.get("/api/event/timeline")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert "timestamp" in data[0]

def test_simulation_endpoint():
    response = client.post("/api/simulate", json={"drainage_capacity": 50, "vegetation": 50, "warning_time": 24})
    assert response.status_code == 200
    data = response.json()
    assert "physical_impact" in data
    assert "human_exposure" in data
    assert "exposure_reduction" in data
