from fastapi import APIRouter,  File, UploadFile, Depends, HTTPException, Body
from fastapi.security import HTTPAuthorizationCredentials
from dao import conexion
from dao.tokenizacionDao import Tokenizacion, auth_scheme, acciones
from dao.ErrorResponse import extraer_mensaje_error
from dao.postulacionesDao import PostulacionesDao,CambiarEstadoPostulacion
import base64

# Registrar nuevos endpoints en un nuevo APIRouter
postulaciones = APIRouter()

@postulaciones.get("/postulacionesConsultarEstadosSolicitud")
async def postulaciones_consultar_estados_solicitud(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        postulaciones_dao = PostulacionesDao(s_opcion=1)
        async with conn.cursor() as cur:
            await cur.callproc('pr_postulaciones', tuple(dict(postulaciones_dao).values()))
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

@postulaciones.post("/postulacionesRegistrar")
async def postulaciones_registrar(
    s_usuario_id: int = Body(...),
    s_plaza_laboral_id: int = Body(...),
    cv: UploadFile = File(...),
    bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)
):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Leer el archivo PDF
        cv_bytes = await cv.read()
        
        # Crear el DAO con los datos recibidos
        postulaciones_dao = PostulacionesDao(
            s_opcion=2,
            s_usuario_id=s_usuario_id,
            s_plaza_laboral_id=s_plaza_laboral_id,
            s_cv=cv_bytes
        )
        
        async with conn.cursor() as cur:
            await cur.callproc('pr_postulaciones', tuple(dict(postulaciones_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
            if result and result2:
                return {"resultado": result[0]["v_mensaje"], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@postulaciones.get("/postulacionesConsultar")
async def postulaciones_consultar(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        postulaciones_dao = PostulacionesDao(s_opcion=3)
        async with conn.cursor() as cur:
            await cur.callproc('pr_postulaciones', tuple(dict(postulaciones_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
            print(result)
            print(result2)

            # Codificar el campo BLOB (cv) a base64
            for row in result:
                if 's_cv' in row and row['s_cv'] is not None:
                    row['s_cv'] = base64.b64encode(row['s_cv']).decode('utf-8')

            if result and result2:
                return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@postulaciones.get("/postulacionesConsultarPorUsuario")
async def postulaciones_consultar_por_usuario(s_usuario_id: int, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        postulaciones_dao = PostulacionesDao(s_opcion=4, s_usuario_id=s_usuario_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_postulaciones', tuple(dict(postulaciones_dao).values()))
            result = await cur.fetchall()
            await cur.nextset()
            result2 = await cur.fetchall()
             # Codificar el campo BLOB (cv) a base64
            for row in result:
                if 's_cv' in row and row['s_cv'] is not None:
                    row['s_cv'] = base64.b64encode(row['s_cv']).decode('utf-8')
            if result and result2:
                return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@postulaciones.put("/postulacionesModificar")
async def postulaciones_modificar(
    s_usuario_id: int = Body(...),
    s_plaza_laboral_id: int = Body(...),
    s_postulacion_id: int = Body(...),
    cv: UploadFile = File(...),
    bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)
):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Leer el archivo PDF
        cv_bytes = await cv.read()
        
        # Crear el DAO con los datos recibidos
        postulaciones_dao = PostulacionesDao(
            s_opcion=5,
            s_usuario_id=s_usuario_id,
            s_plaza_laboral_id=s_plaza_laboral_id,
            s_postulacion_id=s_postulacion_id,
            s_cv=cv_bytes
        )
        
        async with conn.cursor() as cur:
            await cur.callproc('pr_postulaciones', tuple(dict(postulaciones_dao).values()))
            result = await cur.fetchall()
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@postulaciones.put("/postulacionesCambiarEstadoEnProceso")
async def postulaciones_cambiar_estado_en_proceso(objeto: CambiarEstadoPostulacion, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        postulaciones_dao = PostulacionesDao(s_opcion=6, s_postulacion_id=objeto.s_postulacion_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_postulaciones', tuple(dict(postulaciones_dao).values()))
            result = await cur.fetchall()
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@postulaciones.put("/postulacionesCambiarEstadoInformacionPersonal")
async def postulaciones_cambiar_estado_informacion_personal(objeto: CambiarEstadoPostulacion, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        postulaciones_dao = PostulacionesDao(s_opcion=7, s_postulacion_id=objeto.s_postulacion_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_postulaciones', tuple(dict(postulaciones_dao).values()))
            result = await cur.fetchall()
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()

@postulaciones.put("/postulacionesCambiarEstadoFinalizado")
async def postulaciones_cambiar_estado_finalizado(objeto: CambiarEstadoPostulacion, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        postulaciones_dao = PostulacionesDao(s_opcion=8, s_postulacion_id=objeto.s_postulacion_id)
        async with conn.cursor() as cur:
            await cur.callproc('pr_postulaciones', tuple(dict(postulaciones_dao).values()))
            result = await cur.fetchall()
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje": False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()
