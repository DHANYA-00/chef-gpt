from typing import Annotated, Literal, Optional
from uuid import uuid4

from pydantic import BaseModel, Field, StringConstraints

Goal = Literal[
    "any", "quick", "high_protein", "low_calorie", "filling", "healthy", "comfort"
]
Hunger = Literal["light", "normal", "very_hungry"]
Usage = Literal["everything", "as_many", "necessary"]

Ingredient = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=60)
]
Instruction = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=300)
]


# ---------- Core recipe model ----------

class Step(BaseModel):
    text: str = Field(max_length=600)
    timer_seconds: Optional[int] = Field(default=None, ge=0, le=7200)


class RecipeIngredient(BaseModel):
    name: str = Field(max_length=120)
    quantity: str = Field(default="", max_length=60)


class Recipe(BaseModel):
    id: str = Field(default_factory=lambda: uuid4().hex[:8])
    name: str = Field(max_length=120)
    time_minutes: int = Field(ge=1, le=600)
    servings: int = Field(default=2, ge=1, le=20)
    tags: list[str] = Field(default_factory=list)
    uses: list[str] = Field(default_factory=list)
    ingredients: list[RecipeIngredient] = Field(max_length=40)
    steps: list[Step] = Field(min_length=1, max_length=40)
    why: str = Field(default="", max_length=800)
    notes: list[str] = Field(default_factory=list)


# ---------- Generate ----------

class GenerateRequest(BaseModel):
    ingredients: list[Ingredient] = Field(min_length=1, max_length=30)
    goal: Goal = "any"
    time_limit: Optional[int] = Field(default=None, ge=5, le=240)
    hunger: Hunger = "normal"
    usage: Usage = "as_many"
    diet: Optional[str] = Field(default=None, max_length=40)
    calories: Optional[int] = Field(default=None, ge=100, le=5000)


class GenerateResponse(BaseModel):
    status: Literal["ok", "insufficient"]
    message: str = ""
    suggestions: list[str] = Field(default_factory=list)
    recipes: list[Recipe] = Field(default_factory=list)


# ---------- Modify ----------

class ModifyRequest(BaseModel):
    recipe: Recipe
    instruction: Instruction
    ingredients: list[Ingredient] = Field(min_length=1, max_length=30)


class ModifyResponse(BaseModel):
    recipe: Recipe
    summary: str
    changed: bool


# ---------- Substitute ("I don't have X") ----------

class SubstituteRequest(BaseModel):
    recipe: Recipe
    missing: Ingredient
    ingredients: list[Ingredient] = Field(min_length=1, max_length=30)


class SubstituteResponse(BaseModel):
    works: bool
    message: str
    recipe: Recipe
    available: list[str]


# ---------- Rescue ----------

class RescueRequest(BaseModel):
    recipe: Recipe
    problem: Instruction
    step_index: Optional[int] = Field(default=None, ge=0, le=40)
    ingredients: list[Ingredient] = Field(min_length=1, max_length=30)


class RescueResponse(BaseModel):
    summary: str
    fix_steps: list[str]
    safety_note: Optional[str] = None