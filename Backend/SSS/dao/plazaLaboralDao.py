from pydantic import BaseModel
from typing import Optional
# Definición de los DAOs
class PlazaLaboralDao(BaseModel):
    p_opcion: int
    p_plaza_laboral_id: Optional[int] = None
    p_titulo_oferta: Optional[str] = None
    p_descripcion_oferta: Optional[str] = None
    p_cupos_disponibles: Optional[int] = None
    p_modalidad: Optional[str] = None
    p_tipo_contratacion: Optional[str] = None
    p_nombre_empresa: Optional[str] = 'Distecom'
    p_estado: Optional[str] = 'A'

class RegistrarPlazaLaboralDao(BaseModel):
    p_titulo_oferta: str
    p_descripcion_oferta: Optional[str]
    p_cupos_disponibles: int
    p_modalidad: str
    p_tipo_contratacion: str

class ModificarPlazaLaboralDao(BaseModel):
    p_plaza_laboral_id: int
    p_titulo_oferta: str
    p_descripcion_oferta: Optional[str]
    p_cupos_disponibles: int
    p_modalidad: str
    p_tipo_contratacion: str