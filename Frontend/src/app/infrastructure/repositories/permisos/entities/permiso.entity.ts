export interface ResponseData {
    resultado:                      PermisoEntity | PermisoEntity[]
    mensaje:                        boolean
}

export interface PermisoEntity {
    solicitud_empleado_id?:         number
    usuario_id?:                    number
    tipo_solicitud_id?:             number
    descripcion_solicitud:          string
    estado_solicitud_empleado_id?:  number
    fecha_inicio?:                  Date
    fecha_fin?:                     Date
    fecha_ingreso?:                 Date
    nombre?:                        string
    apellido?:                      string
    tipo:                           string
    nombre_estado_solicitud:        string
    estado:                         string
}

