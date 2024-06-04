# Rutas del inicio
from servicios.inicio import ruta
from servicios.solicitudService import solicitud
from servicios.usuarioService import usuario
# Parámetros de solicitud 
from fastapi import FastAPI
# Middleware CORS
from fastapi.middleware.cors import CORSMiddleware 
# Servidor UVicorn
import uvicorn  
# Configuración environments
from environments import api  

sss=FastAPI()
# CORS

sss.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_origins=["*"]
)

sss.include_router(
    ruta,
    prefix='/v1',
    tags=['inicio'],
    responses={404: {'response': 'Error'}}
)

sss.include_router(
    usuario,
    prefix='/v1',
    tags=['usuario'],
    responses={404: {'response': 'Error'}}
)

sss.include_router(
    solicitud,
    prefix='/v1',
    tags=['solicitud'],
    responses={404: {'response': 'Error'}}
)


if __name__=="__main__":
    uvicorn.run(host=api.Api.HOST,port=api.Api.PORT,app=sss)