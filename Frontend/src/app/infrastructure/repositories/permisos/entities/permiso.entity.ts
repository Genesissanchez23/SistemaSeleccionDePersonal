export interface ResponseData {
    resultado:                          PermisoEntity | PermisoEntity[]
    mensaje:                            boolean
}

export interface PermisoEntity {
    s_solicitud_empleado_id?:           number
    s_usuario_id?:                      number
    s_tipo_solicitud_id?:               number
    s_descripcion_solicitud?:           string
    s_estado_solicitud_empleado_id?:    number
    s_fecha_inicio?:                    Date
    s_fecha_fin?:                       Date
    s_fecha_ingreso?:                   Date
    s_nombre?:                          string
    s_apellido?:                        string
    s_tipo?:                            string
    tipo?:                              string
    s_nombre_estado_solicitud?:         string
    s_estado?:                          string
}

