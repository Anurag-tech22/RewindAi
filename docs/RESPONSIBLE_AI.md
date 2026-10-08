# Responsible AI

The RewindAI project follows strict responsible AI principles, especially concerning disaster modeling:

1. **Model Confidence vs Causality**: The application specifically notes that AI findings are "model contribution signals" and not "proven causal effects."
2. **Deterministic Processing**: AI (Gemma) is strictly used as an explainer and summarizer. It is NOT allowed to calculate the numerical exposure reductions or impacts itself. Structured deterministic models or ML regression models generate the JSON payload, which the LLM translates into human-readable text.
3. **Logical Defensibility**: Warning times and human interventions only impact "Human Exposure" in the model, not the physical force of the climate event.
