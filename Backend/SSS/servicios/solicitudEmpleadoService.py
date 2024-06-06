from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from dao import conexion
from dao.tokenizacionDao import Tokenizacion, auth_scheme, acciones
from dao.ErrorResponse import extraer_mensaje_error
from dao.solicitudEmpleadoDao import SolicitudEmpleadoDao,ModificarSolicitudEmpleadoDao,RegistrarSolicitudEmpleadoDao

solicitud_empleado = APIRouter()

@solicitud_empleado.get("/consultarEstadosSolicitud")
async def consultar_estados_solicitud(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        solicitud_empleado_dao = SolicitudEmpleadoDao(s_opcion=1)
        async with conn.cursor() as cur:
            await cur.callproc('pr_solicitud_empleado', tuple(dict(solicitud_empleado_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            print(result)
            print(result2)
            if result and result2:
                return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@solicitud_empleado.post("/registrarSolicitudEmpleado")
async def registrar_solicitud_empleado(solicitud_body: RegistrarSolicitudEmpleadoDao = Body(...), bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        solicitud_empleado_dao = SolicitudEmpleadoDao(s_opcion=2, **solicitud_body.dict())
        async with conn.cursor() as cur:
            await cur.callproc('pr_solicitud_empleado', tuple(dict(solicitud_empleado_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
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

@solicitud_empleado.get("/consultarSolicitudesEmpleado")
async def consultar_solicitudes_empleado(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        solicitud_empleado_dao = SolicitudEmpleadoDao(s_opcion=3)
        async with conn.cursor() as cur:
            await cur.callproc('pr_solicitud_empleado', tuple(dict(solicitud_empleado_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            print(result)
            print(result2)
            if result and result2:
                return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@solicitud_empleado.get("/consultarSolicitudesEmpleadoPorUsuario")
async def consultar_solicitudes_empleado_por_usuario(s_usuario_id: int, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        solicitud_empleado_dao = SolicitudEmpleadoDao(s_opcion=4, s_usuario_id=s_usuario_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_solicitud_empleado', tuple(dict(solicitud_empleado_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            print(result)
            print(result2)
            if result and result2:
                return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@solicitud_empleado.put("/modificarSolicitudEmpleado")
async def modificar_solicitud_empleado(solicitud_body: ModificarSolicitudEmpleadoDao = Body(...), bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:

        solicitud_empleado_dao2 = SolicitudEmpleadoDao(s_opcion=5, **solicitud_body.dict())
        async with conn.cursor() as cur:
            await cur.callproc('pr_solicitud_empleado', tuple(dict(solicitud_empleado_dao2).values()))
            result = await cur.fetchall()
            print(result)
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@solicitud_empleado.put("/aceptarSolicitudEmpleado")
async def aceptar_solicitud_empleado(s_solicitud_empleado_id: int, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        solicitud_empleado_dao = SolicitudEmpleadoDao(s_opcion=6, s_solicitud_empleado_id=s_solicitud_empleado_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_solicitud_empleado', tuple(dict(solicitud_empleado_dao).values()))
            result = await cur.fetchall()
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@solicitud_empleado.put("/declinarSolicitudEmpleado")
async def declinar_solicitud_empleado(s_solicitud_empleado_id: int, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        solicitud_empleado_dao = SolicitudEmpleadoDao(s_opcion=7, s_solicitud_empleado_id=s_solicitud_empleado_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_solicitud_empleado', tuple(dict(solicitud_empleado_dao).values()))
            result = await cur.fetchall()
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()
