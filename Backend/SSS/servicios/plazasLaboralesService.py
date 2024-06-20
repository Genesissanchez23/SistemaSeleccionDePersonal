from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from dao import conexion
from dao.tokenizacionDao import Tokenizacion, auth_scheme, acciones
from dao.ErrorResponse import extraer_mensaje_error
from pydantic import BaseModel
from typing import Optional
from dao.plazaLaboralDao import PlazaLaboralDao,RegistrarPlazaLaboralDao,ModificarPlazaLaboralDao
plaza_laboral = APIRouter()

# Registrar una nueva plaza laboral
@plaza_laboral.post("/registrarPlazaLaboral")
async def registrar_plaza_laboral(plaza_body: RegistrarPlazaLaboralDao = Body(...), bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        plaza_laboral_dao = PlazaLaboralDao(s_opcion=1, **plaza_body.dict())
        print(plaza_laboral_dao)
        async with conn.cursor() as cur:
            await cur.callproc('pr_plaza_laboral', tuple(dict(plaza_laboral_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
            print(result)
            print(result2)
            if result and result2:
                return {"resultado": result[0]["v_mensaje"], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

# Consultar una plaza laboral por ID
@plaza_laboral.get("/consultarPlazaLaboralPorId")
async def consultar_plaza_laboral_por_id(s_plaza_laboral_id: int, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        plaza_laboral_dao = PlazaLaboralDao(s_opcion=2, s_plaza_laboral_id=s_plaza_laboral_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_plaza_laboral', tuple(dict(plaza_laboral_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
            if result and result2:
                return {"resultado": result[0], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

# Consultar todas las plazas laborales
@plaza_laboral.get("/consultarPlazasLaborales")
async def consultar_plazas_laborales(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        plaza_laboral_dao = PlazaLaboralDao(s_opcion=3, s_plaza_laboral_id=None)
        async with conn.cursor() as cur:
            await cur.callproc('pr_plaza_laboral', tuple(dict(plaza_laboral_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
            if result and result2:
                return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

# Modificar una plaza laboral
@plaza_laboral.put("/modificarPlazaLaboral")
async def modificar_plaza_laboral(plaza_body: ModificarPlazaLaboralDao = Body(...), bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        plaza_laboral_dao = PlazaLaboralDao(s_opcion=4, **plaza_body.dict())
        async with conn.cursor() as cur:
            await cur.callproc('pr_plaza_laboral', tuple(dict(plaza_laboral_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
            print(result)
            print(result2)
            if result and result2:
                return {"resultado": result[0]["v_mensaje"], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

# Eliminar (cambiar el estado a 'N') una plaza laboral
@plaza_laboral.delete("/eliminarPlazaLaboral")
async def eliminar_plaza_laboral(s_plaza_laboral_id: int, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        plaza_laboral_dao = PlazaLaboralDao(s_opcion=5, s_plaza_laboral_id=s_plaza_laboral_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_plaza_laboral', tuple(dict(plaza_laboral_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
            print(result)
            print(result2)
            if result and result2:
                return {"resultado": result[0]["v_mensaje"], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()
