from pydantic import BaseModel
from typing import Optional

class SolicitudEmpleadoDao(BaseModel):
    s_opcion: int
    s_solicitud_empleado_id: Optional[int] = None
    s_usuario_id: Optional[int] = None
    s_tipo_solicitud_id: Optional[int] = None
    s_descripcion_solicitud: Optional[str] = None
    s_estado_solicitud_empleado_id: Optional[int] = None
    s_fecha_inicio: Optional[str] = None
    s_fecha_fin: Optional[str] = None



class ModificarSolicitudEmpleadoDao(BaseModel):
    s_solicitud_empleado_id: Optional[int] = None
    s_usuario_id: Optional[int] = None
    s_tipo_solicitud_id: Optional[int] = None
    s_descripcion_solicitud: Optional[str] = None
    s_fecha_inicio: Optional[str] = None
    s_fecha_fin: Optional[str] = None


class RegistrarSolicitudEmpleadoDao(BaseModel):
    s_usuario_id: Optional[int] = None
    s_tipo_solicitud_id: Optional[int] = None
    s_descripcion_solicitud: Optional[str] = None
    s_fecha_inicio: Optional[str] = None
    s_fecha_fin: Optional[str] = None
