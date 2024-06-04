from pydantic import BaseModel
from typing import Optional

class TipoSolicitudDao(BaseModel):
    s_opcion: int
    s_tipo_solicitud_id: Optional[int] = None
    s_tipo: Optional[str] = None


class RegistrarTipoSolicitudDao(BaseModel):
    s_tipo: str
