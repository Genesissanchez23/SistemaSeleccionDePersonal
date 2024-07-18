export interface ResponseData {
    resultado:              PostulacionEntity | PostulacionEntity[]
    mensaje:                boolean
}

export interface PostulacionEntity {
    s_postulacion_id?:                  number
    s_usuario_id?:                      number
    s_plaza_laboral_id?:                number
    s_estado_solicitud_postulante_id?:  number
    s_fecha_ingreso?:                   Date
    s_cv?:                              File
    s_alias?:                           string
    s_nombre?:                          string
    s_apellido?:                        string
    s_titulo_oferta?:                   string
    s_nombre_estado_solicitud?:         string
    s_estado?:                          string
    s_fecha_entrevista:                 Date
    s_id_formulario_datos_personales:   number
    s_formulario_entrevista:            string
}
