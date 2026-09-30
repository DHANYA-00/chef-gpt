from fastapi import FastAPI, HTTPException

import groq_service as svc
from schemas import (
    GenerateRequest,
    GenerateResponse,
    ModifyRequest,
    ModifyResponse,
    RescueRequest,
    RescueResponse,
    SubstituteRequest,
    SubstituteResponse,
)

app = FastAPI(title="Chef-GPT API", version="2.0.0")


def _run(fn, req):
    try:
        return fn(req)
    except svc.LLMError:
        raise HTTPException(
            status_code=503,
            detail="Chef-GPT could not produce a reliable answer right now. Please try again.",
        )


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/recipes/generate", response_model=GenerateResponse)
def generate(req: GenerateRequest):
    return _run(svc.generate_recipes, req)


@app.post("/api/recipes/modify", response_model=ModifyResponse)
def modify(req: ModifyRequest):
    return _run(svc.modify_recipe, req)


@app.post("/api/recipes/substitute", response_model=SubstituteResponse)
def substitute(req: SubstituteRequest):
    return _run(svc.substitute_ingredient, req)


@app.post("/api/recipes/rescue", response_model=RescueResponse)
def rescue(req: RescueRequest):
    return _run(svc.rescue_meal, req)