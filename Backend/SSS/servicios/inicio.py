from fastapi import APIRouter

ruta = APIRouter()

@ruta.get("/inicio")
async def inicio():
    return {"response": "Bienvenido"}