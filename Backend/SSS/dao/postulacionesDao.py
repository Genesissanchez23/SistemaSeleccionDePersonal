from pydantic import BaseModel
from typing import Optional

class PostulacionesDao(BaseModel):
    s_opcion: int
    s_postulacion_id: Optional[int] = None
    s_usuario_id: Optional[int] = None
    s_plaza_laboral_id: Optional[int] = None
    s_cv: Optional[bytes] = None
    s_estado_solicitud_postulante_id: Optional[int] = None


class CambiarEstadoPostulacion(BaseModel):
    s_postulacion_id: int