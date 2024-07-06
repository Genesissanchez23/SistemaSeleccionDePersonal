from fastapi import APIRouter, HTTPException, Request, Body,Depends
from datetime import datetime, timedelta
from fastapi.security import HTTPAuthorizationCredentials
from dao.tokenizacionDao import Tokenizacion,auth_scheme,acciones
from dao.usuarioDao import UsuarioDao
from dao.usuarioDao import UsuarioLogin,UsuarioRegistro,UsuarioConsulta,UsuarioActualizar,UsuarioPostulante
from dao import conexion
from dao.Encriptacion import Encriptacion
from environments import api
from dao.ErrorResponse import extraer_mensaje_error

usuario = APIRouter()

@usuario.post("/login")
async def login(request: Request, usuario_login: UsuarioLogin = Body(...)):
    conn = await conexion.conectar()
    try:
        password_manager = Encriptacion()
        # Encriptar una contraseña
        
        password = usuario_login.s_contrasena
        hashed_password = password_manager.encriptar(password)
        print(hashed_password)
        # Mapear los datos de UsuarioLogin a UsuarioDao
        usuario_dao = UsuarioDao(
            s_opcion=0,
            **usuario_login.dict()
        )
        
        # Pasar los valores del diccionario como una tupla
        async with conn.cursor() as cur:
            await cur.callproc('pr_usuario', tuple(dict(usuario_dao).values()))
            value = await cur.fetchall()
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            # Obtener el segundo conjunto de resultados
            value2 = await cur.fetchall()
            if  value  and value2:
                usuario_dao.s_opcion=3
                usuario_dao.s_contrasena = value[0]["v_contrasena_hash"] 
                print("dao :",usuario_dao.s_contrasena)
                print("login :",usuario_login.s_contrasena)
                if password_manager.verificar(password,usuario_dao.s_contrasena):
                    print("Sdsd")
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
                        return {"resultado": access_token, "mensaje":bool(result2[0]["mensaje"])}
                
            return {"resultado": "", "mensaje":False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje":False}
    finally:
        conn.close()



@usuario.post("/registrar")
async def registrar_usuario(usuario_registro: UsuarioRegistro = Body(...),bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        password_manager = Encriptacion()
        # Encriptar una contraseña
        password = usuario_registro.s_contrasena
        hashed_password = password_manager.encriptar(password)
        usuario_registro.s_contrasena = hashed_password
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
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje":True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje":False}
    finally:
        conn.close()

@usuario.post("/registrarPostulante")
async def registrar_postulante(usuario_registro: UsuarioPostulante = Body(...)):

    conn = await conexion.conectar()
    try:
        password_manager = Encriptacion()
        # Encriptar una contraseña
        password = usuario_registro.s_contrasena
        hashed_password = password_manager.encriptar(password)
        usuario_registro.s_contrasena = hashed_password
        # Mapear los datos de UsuarioRegistro a UsuarioDao
        usuario_dao = UsuarioDao(
            s_opcion=1,
            **usuario_registro.dict() ,
            s_tipo_usuario_id = 3
        )

        # Ejecutar el procedimiento almacenado
        async with conn.cursor() as cur:
            await cur.callproc('pr_usuario', tuple(dict(usuario_dao).values()))
            result = await cur.fetchall()
            print(result[0])
            # Pasar al siguiente conjunto de resultados
            await cur.nextset()
            if result:
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje":True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje":False}
    finally:
        conn.close()


@usuario.get("/consultarPorId")
async def consultar_por_id(s_usuario_id: int,bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
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
                return {"resultado": result[0], "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje":True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje":False}
    finally:
        conn.close()


@usuario.put("/actualizarUsuario")
async def actualizar_usuario(usuario_actualizado: UsuarioActualizar = Body(...),bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        password_manager = Encriptacion()
        # Encriptar una contraseña
        password = usuario_actualizado.s_contrasena
        hashed_password = password_manager.encriptar(password)
        usuario_actualizado.s_contrasena = hashed_password
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
                return {"resultado": "", "mensaje": bool(result[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje":False}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje":False}
    finally:
        conn.close()


@usuario.get("/consultarTodos")
async def consultar_todos(bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
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
                return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje":True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje":False}
    finally:
        conn.close()



@usuario.get("/consultarTipos")
async def consultar_tipos():
    conn = await conexion.conectar()
    try:
        # Mapear los datos 
        usuario_dao = UsuarioDao(
            s_opcion=6
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
                return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
            else:
                return {"resultado": "", "mensaje":True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje":False}
    finally:
        conn.close()

@usuario.get("/consultarTodosPorTipo")
async def consultar_todos_por_tipo(s_tipo: str, bearer: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    accion = acciones.get(Tokenizacion.ValidarToken(bearer), lambda: None)
    if accion is not None:
        return accion
    conn = await conexion.conectar()
    try:
        # Consultar la opción 6 del procedimiento almacenado para obtener los tipos de usuario
        usuario_dao_tipos = UsuarioDao(
            s_opcion=6
        )
        async with conn.cursor() as cur:
            await cur.callproc('pr_usuario', tuple(dict(usuario_dao_tipos).values()))
            tipos_usuario = await cur.fetchall()
            
            # Verificar si el tipo de usuario proporcionado está en los tipos obtenidos
            tipo_usuario_id = None
            for tipo in tipos_usuario:
                if tipo["s_tipo"].lower() == s_tipo.lower():
                    tipo_usuario_id = tipo["s_tipo_usuario_id"]
                    break
              
            if tipo_usuario_id is not None:
                # Si se encontró un tipo de usuario coincidente, proceder con la opción 7
                usuario_dao_consulta = UsuarioDao(
                    s_opcion=7,
                    s_tipo_usuario_id=tipo_usuario_id
                )
                
                await cur.callproc('pr_usuario', tuple(dict(usuario_dao_consulta).values()))
                result = await cur.fetchall()
                await cur.nextset()
                result2 = await cur.fetchall()
                if result and result2:
                    return {"resultado": result, "mensaje": bool(result2[0]["mensaje"])}
                else:
                    return {"resultado": "", "mensaje": True}
            else:
                    return {"resultado": "El tipo de usuario no coincide", "mensaje": True}
    except Exception as e:
        return {"resultado": extraer_mensaje_error(str(e)), "mensaje": False}
    finally:
        conn.close()
