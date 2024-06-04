from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from dao import conexion
from dao.tokenizacionDao import Tokenizacion, auth_scheme, acciones
from dao.ErrorResponse import extraer_mensaje_error
from dao.tipoSolicitudDao import TipoSolicitudDao
from dao.tipoSolicitudDao import RegistrarTipoSolicitudDao

solicitud = APIRouter()

@solicitud.get("/consultarSolicitudPorId")
async def consultar_solicitud_por_id(s_tipo_solicitud_id: int, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Mapear los datos
        tipo_solicitud_dao = TipoSolicitudDao(s_opcion=1, s_tipo_solicitud_id=s_tipo_solicitud_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_tipo_solicitud', tuple(dict(tipo_solicitud_dao).values()))
            result = await cur.fetchall()
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            if result  and result2:
                return {"resultado": result[0], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@solicitud.get("/consultarSolicitudPorTipo")
async def consultar_solicitud_por_tipo(s_tipo: str, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Mapear los datos
        tipo_solicitud_dao = TipoSolicitudDao(s_opcion=2, s_tipo=s_tipo)
        async with conn.cursor() as cur:
            await cur.callproc('pr_tipo_solicitud', tuple(dict(tipo_solicitud_dao).values()))
            result = await cur.fetchall()
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            if result  and result2:
                return {"resultado": result[0], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@solicitud.get("/consultarSolicitudes")
async def consultar_solicitudes(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Mapear los datos
        tipo_solicitud_dao = TipoSolicitudDao(s_opcion=3)
        
        async with conn.cursor() as cur:
            await cur.callproc('pr_tipo_solicitud', tuple(dict(tipo_solicitud_dao).values()))
            result = await cur.fetchall()
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            print(result)
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            print(result2)
            if result and result2:
                return {"resultado": result[0], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@solicitud.post("/registrarSolicitud")
async def registrar_tipo_solicitud(solicitud_body: RegistrarTipoSolicitudDao = Body(...), bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Mapear los datos
        print(solicitud_body)
        tipo_solicitud_dao = TipoSolicitudDao(s_opcion=4, **solicitud_body.dict())
        async with conn.cursor() as cur:
            await cur.callproc('pr_tipo_solicitud', tuple(dict(tipo_solicitud_dao).values()))
            result = await cur.fetchall()
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

