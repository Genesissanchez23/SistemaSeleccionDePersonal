from pydantic import BaseModel
from pydantic import BaseModel
from typing import Optional
# Clase de modelo para los datos de entrada de la opción 3 del procedimiento almacenado
class UsuarioLogin(BaseModel):
    s_alias: str 
    s_contrasena: str  

     
class UsuarioDao(BaseModel):
    s_opcion: int
    s_alias: Optional[str] = None
    s_contrasena: Optional[str] = None
    s_estado: Optional[str] = None
    s_tipo_usuario_id: Optional[int] = None
    s_nombre: Optional[str] = None
    s_apellido: Optional[str] = None
    s_cedula: Optional[str] = None
    s_direccion: Optional[str] = None
    s_correo: Optional[str] = None
    s_usuario_id: Optional[int] = None

class UsuarioActualizar(BaseModel):
    s_alias: Optional[str] = None
    s_contrasena: Optional[str] = None
    s_tipo_usuario_id: Optional[int] = None
    s_nombre: Optional[str] = None
    s_apellido: Optional[str] = None
    s_cedula: Optional[str] = None
    s_direccion: Optional[str] = None
    s_correo: Optional[str] = None
    s_usuario_id: Optional[int] = None


class UsuarioRegistro(BaseModel):
    s_alias: str
    s_contrasena: str
    s_tipo_usuario_id: int
    s_nombre: str
    s_apellido: str
    s_cedula: str
    s_direccion: str
    s_correo: str

class UsuarioPostulante(BaseModel):
    s_alias: str
    s_contrasena: str
    s_nombre: str
    s_apellido: str
    s_cedula: str
    s_direccion: str
    s_correo: str

class UsuarioConsulta(BaseModel):
    s_usuario_id: int