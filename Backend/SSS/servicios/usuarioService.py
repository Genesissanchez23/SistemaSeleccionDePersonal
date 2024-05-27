from fastapi import APIRouter, HTTPException, Request, Body,Depends
from datetime import datetime, timedelta
from fastapi.security import HTTPAuthorizationCredentials
from dao.tokenizacionDao import Tokenizacion,auth_scheme,acciones
from dao.usuarioDao import UsuarioDao
from dao.usuarioDao import UsuarioLogin,UsuarioRegistro,UsuarioConsulta,UsuarioActualizar
from dao import conexion
from environments import api

usuario = APIRouter()

@usuario.post("/login")
async def login(request: Request, usuario_login: UsuarioLogin = Body(...)):
    conn = await conexion.conectar()
    try:
        # Mapear los datos de UsuarioLogin a UsuarioDao
        usuario_dao = UsuarioDao(
            s_opcion=3,
            **usuario_login.dict()
        )
        # Pasar los valores del diccionario como una tupla
        async with conn.cursor() as cur:
            await cur.callproc('pr_usuario', tuple(dict(usuario_dao).values()))
            result = await cur.fetchall()
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            if result  and result2:
                usuario_id = result[0]["s_usuario_id"]
                nombre = result[0]["s_nombre"]
                apellido = result[0]["s_apellido"]
                tipo = result[0]["s_tipo_usuario"]
                id_tipo = result[0]["s_tipo_usuario_id"]
                
                # Generar token de acceso
                token_data = {
                    "s_usuario_id": usuario_id,
                    "s_nombre": nombre,
                    "s_apellido": apellido,
                    "s_tipo_usuario": tipo,
                    "s_tipo_usuario_id": id_tipo,
                    "exp": datetime.utcnow() + timedelta(minutes=api.Api.TOKEN_TIME)
                }
                
                access_token = Tokenizacion.generarToken(token_data)
                return {"resultado": access_token, "mensaje":result2[0]["mensaje"]}
            else:
                return {"resultado": "", "mensaje":"False"}
    except Exception as e:
        return {"resultado": str(e), "mensaje":"False"}
    finally:
        conn.close()



@usuario.post("/registrar")
async def registrar_usuario(usuario_registro: UsuarioRegistro = Body(...),bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Mapear los datos de UsuarioRegistro a UsuarioDao
        usuario_dao = UsuarioDao(
            s_opcion=1,
            **usuario_registro.dict() 
        )

        # Ejecutar el procedimiento almacenado
        async with conn.cursor() as cur:
            await cur.callproc('pr_usuario', tuple(dict(usuario_dao).values()))
            result = await cur.fetchall()
            print(result[0])
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            if result:
                return {"resultado": "", "mensaje": result[0]["mensaje"]}
            else:
                return {"resultado": "", "mensaje":"True"}
    except Exception as e:
        return {"resultado": str(e), "mensaje":"False"}
    finally:
        conn.close()


@usuario.get("/consultarPorId")
async def consultar_usuario(s_usuario_id: int,bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Mapear los datos 
        usuario_dao = UsuarioDao(
            s_opcion=2,
            s_usuario_id = s_usuario_id
        )
        # Crear una instancia de UsuarioDao con los datos proporcionados
        print(tuple(dict(usuario_dao).values()))
        # Ejecutar el procedimiento almacenado
        async with conn.cursor() as cur:
            await cur.callproc('pr_usuario', tuple(dict(usuario_dao).values()))
            result = await cur.fetchall()
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            if result and result2:
                return {"resultado": result[0], "mensaje": result2[0]["mensaje"]}
            else:
                return {"resultado": "", "mensaje":"True"}
    except Exception as e:
        return {"resultado": str(e), "mensaje":"False"}
    finally:
        conn.close()


@usuario.put("/actualizarUsuario")
async def actualizar_usuario(usuario_actualizado: UsuarioActualizar = Body(...),bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Mapear los datos 
        usuario_dao = UsuarioDao(
            s_opcion=4,
            **usuario_actualizado.dict()
        )

        # Ejecutar el procedimiento almacenado
        async with conn.cursor() as cur:
            await cur.callproc('pr_usuario', tuple(usuario_dao.dict().values()))
            result = await cur.fetchall()
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            print(result)
            if result:
                return {"resultado": "", "mensaje": result[0]["mensaje"]}
            else:
                return {"resultado": "", "mensaje":"False"}
    except Exception as e:
        return {"resultado": str(e), "mensaje":"False"}
    finally:
        conn.close()


@usuario.get("/consultarTodos")
async def consultar_usuario(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Mapear los datos 
        usuario_dao = UsuarioDao(
            s_opcion=5
        )
        # Crear una instancia de UsuarioDao con los datos proporcionados
        print(tuple(dict(usuario_dao).values()))
        # Ejecutar el procedimiento almacenado
        async with conn.cursor() as cur:
            await cur.callproc('pr_usuario', tuple(dict(usuario_dao).values()))
            result = await cur.fetchall()
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            result2 = await cur.fetchall()
            if result and result2:
                return {"resultado": result, "mensaje": result2[0]["mensaje"]}
            else:
                return {"resultado": "", "mensaje":"True"}
    except Exception as e:
        return {"resultado": str(e), "mensaje":"False"}
    finally:
        conn.close()