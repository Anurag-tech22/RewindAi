# RewindAI Architecture

                  ┌───────────────────────┐
                  │ Weather / Climate Data│
                  └───────────┬───────────┘
                              │
                  ┌───────────▼───────────┐
                  │   Feature Engineering │
                  └───────────┬───────────┘
                              │
                  ┌───────────▼───────────┐
                  │ Climate Event Model   │
                  │                       │
                  │ TabPFN / ML model     │
                  └───────────┬───────────┘
                              │
                  ┌───────────▼───────────┐
                  │ Event Reconstruction  │
                  └───────────┬───────────┘
                              │
             ┌────────────────┴────────────────┐
             │                                 │
   ┌─────────▼─────────┐             ┌────────▼────────┐
   │ Evidence Engine   │             │ Rewind Engine   │
   └─────────┬─────────┘             └────────┬────────┘
             │                                 │
             └────────────────┬────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Intervention Rank │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Gemma AI Explainer│
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │ Premium Web UI    │
                    └───────────────────┘

## Core Flow
1. **Predict:** TabPFN / ML model ingests historical weather and climate features.
2. **Explain:** The Evidence Engine calculates structured feature importances/contributions (e.g., rainfall, soil saturation).
3. **Rewind:** The Rewind Engine adjusts specific parameters (like drainage capacity or warning time) as counterfactuals.
4. **Simulate:** Re-run the simulation to determine the physical impact and human exposure reduction.
5. **Recommend:** Feed structured JSON results to Gemma to generate natural language explanations for end-users, ensuring that the model differentiates between "model contribution" and "causal effect."
