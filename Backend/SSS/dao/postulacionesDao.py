from pydantic import BaseModel
from typing import Optional

class PostulacionesDao(BaseModel):
    p_opcion: int
    p_postulacion_id: Optional[int] = None
    p_usuario_id: Optional[int] = None
    p_plaza_laboral_id: Optional[int] = None
    p_cv: Optional[bytes] = None
    p_estado_solicitud_postulante_id: Optional[int] = None
