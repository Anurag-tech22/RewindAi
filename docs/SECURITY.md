# Security Review & Fixes

During our internal security audit, we resolved the following issues to ensure RewindAI is safe and production-ready:

| Threat | Risk | Mitigation | Remaining Limitation |
|--------|------|------------|----------------------|
| **API Key Leakage** | High | Environment variables (`.env`) used. Frontend never sees the Gemma API key; all AI requests are routed securely through the backend. | Requires secure secret injection in production (e.g. AWS Secrets Manager). |
| **Invalid Simulation Inputs** | Medium | Strict Pydantic bounding (e.g., `ge=0, le=100`) prevents negative capacities or impossible warning times that could crash the ML model. | ML bounds are linear; extreme edge cases (100% intervention) may still produce physically unlikely outcomes. |
| **CORS Exploitation** | Medium | CORS is restricted strictly to local frontend origins (`http://localhost:5173`) in `main.py`. | Needs to be updated to the production domain upon deployment. |
| **AI Prompt Injection** | Low | The LLM is only fed structured, pre-calculated JSON by the backend. It does not execute code or perform raw math operations. | An attacker could theoretically try to manipulate the simulation JSON if they bypass Pydantic, but Pydantic blocks non-numeric inputs. |
| **DDoS / Rate Limiting** | Low | Implemented an HTTP middleware abstraction in `main.py` ready to track client IPs. | Currently in-memory; needs Redis for distributed scaling. |
