from pydantic import BaseModel
from typing import Optional
# Definición de los DAOs
class PlazaLaboralDao(BaseModel):
    s_opcion: int
    s_plaza_laboral_id: Optional[int] = None
    s_titulo_oferta: Optional[str] = None
    s_descripcion_oferta: Optional[str] = None
    s_cupos_disponibles: Optional[int] = None
    s_modalidad: Optional[str] = None
    s_tipo_contratacion: Optional[str] = None
    s_nombre_empresa: Optional[str] = 'Distecom'
    s_estado: Optional[str] = 'A'

class RegistrarPlazaLaboralDao(BaseModel):
    s_titulo_oferta: str
    s_descripcion_oferta: Optional[str]
    s_cupos_disponibles: int
    s_modalidad: str
    s_tipo_contratacion: str

class ModificarPlazaLaboralDao(BaseModel):
    s_plaza_laboral_id: int
    s_titulo_oferta: str
    s_descripcion_oferta: Optional[str]
    s_cupos_disponibles: int
    s_modalidad: str
    s_tipo_contratacion: str