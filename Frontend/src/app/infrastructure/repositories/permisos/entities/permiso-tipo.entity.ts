export interface ResponseData {
    resultado:                      PermisoTipoEntity | PermisoTipoEntity[]
    mensaje:                        boolean
}

export interface PermisoTipoEntity {
    tipo_solicitud_id?:             number
    tipo?:                          string
    fecha_ingreso?:                 Date
}
