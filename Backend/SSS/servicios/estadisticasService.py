from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from dao import conexion
from dao.tokenizacionDao import Tokenizacion, auth_scheme, acciones
from dao.ErrorResponse import extraer_mensaje_error

estadisticas = APIRouter()

async def ejecutar_procedimiento(s_opcion: int):
    conn = await conexion.conectar()
    try:
        async with conn.cursor() as cur:
            await cur.callproc('pr_estadisticas', (s_opcion,))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
            return result, result2
    except Exception as e:
        return None, str(e)
    finally:
        conn.close()

@estadisticas.get("/dashboardCardUno")
async def dashboardCardUno(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion

    result, error = await ejecutar_procedimiento(1)
    if error:
        return {"resultado": extraer_mensaje_error(error), "mensaje": False}

    if result:
        return [
            {"label": "Plazas Activas", "value": result[0]['TOTAL_PLAZAS_LABORALES']},
            {"label": "Empleados", "value": result[0]['TOTAL_EMPLEADOS']},
            {"label": "Postulantes", "value": result[0]['TOTAL_POSTULANTES']}
        ]
    else:
        return {"resultado": "", "mensaje": False}

@estadisticas.get("/dashboardCardDos")
async def dashboardCardDos(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion

    result, error = await ejecutar_procedimiento(2)
    if error:
        return {"resultado": extraer_mensaje_error(error), "mensaje": False}

    if result:
        response = []
        for row in result:
            response.append({
                "name": row['name'],
                "series": [
                    {"name": "Plazas Activas", "value": row['Plazas Activas']},
                    {"name": "Plazas Eliminadas", "value": row['Plazas Eliminadas']}
                ]
            })
        return response
    else:
        return {"resultado": "", "mensaje": False}

@estadisticas.get("/dashboardCardTres")
async def dashboardCardTres(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion

    result, error = await ejecutar_procedimiento(3)
    if error:
        return {"resultado": extraer_mensaje_error(error), "mensaje": False}

    if result:
        return [
            {"name": "Postulantes Enviadas", "value": result[0]['value']},
            {"name": "Postulantes En Proceso", "value": result[1]['value']},
            {"name": "Postulantes Rechazadas", "value": result[2]['value']},
            {"name": "Solicitudes de Empleados", "value": result[3]['value']}
        ]
    else:
        return {"resultado": "", "mensaje": False}

@estadisticas.get("/dashboardCardCuatro")
async def dashboardCardCuatro(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion

    result, error = await ejecutar_procedimiento(4)
    if error:
        return {"resultado": extraer_mensaje_error(error), "mensaje": False}

    if result:
        response = []
        for row in result:
            response.append({
                "name": row['name'],
                "series": [
                    {"name": "Plazas Activas", "value": row['Plazas Activas']},
                    {"name": "Plazas Eliminadas", "value": row['Plazas Eliminadas']}
                ]
            })
        return response
    else:
        return {"resultado": "", "mensaje": False}

@estadisticas.get("/dashboardCardCinco")
async def dashboardCardCinco(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion

    result, error = await ejecutar_procedimiento(5)
    if error:
        return {"resultado": extraer_mensaje_error(error), "mensaje": False}

    if result:
        return [
            {"name": "Permisos Aceptados", "value": result[0]['value']},
            {"name": "Permisos Rechazados", "value": result[1]['value']},
            {"name": "Permisos Pendientes", "value": result[2]['value']}
        ]
    else:
        return {"resultado": "", "mensaje": False}
