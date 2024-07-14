from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PostulacionesDao(BaseModel):
    s_opcion: int
    s_postulacion_id: Optional[int] = None
    s_usuario_id: Optional[int] = None
    s_plaza_laboral_id: Optional[int] = None
    s_cv: Optional[bytes] = None
    s_estado_solicitud_postulante_id: Optional[int] = None
    s_fecha_entrevista: Optional[datetime] = None
    s_formulario_entrevista: Optional[str] = None
    s_telefono: Optional[str] = None
    s_cargo: Optional[str] = None
    s_banco: Optional[str] = None
    s_sueldo: Optional[float] = None
    s_cuenta_bancaria: Optional[str] = None
    s_tipo_sangre: Optional[str] = None


class CambiarEstadoPostulacion(BaseModel):
    s_postulacion_id: int

class CambiarEstadoPostulacionEnProceso(BaseModel):
    s_postulacion_id: int
    s_fecha_entrevista: datetime

class CambiarEstadoPostulacionEviarEntrevista(BaseModel):
    s_postulacion_id: int
    s_formulario_entrevista: str

class CambiarEstadoPostulacionFinalizado(BaseModel):
    s_postulacion_id: int
    s_telefono: str
    s_cargo: str
    s_sueldo: float
    s_cuenta_bancaria: str
    s_tipo_sangre: str
    s_banco:str