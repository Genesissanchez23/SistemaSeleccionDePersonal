export interface ResponseData {
    resultado:              TrabajoEntity | TrabajoEntity[] | string,
    mensaje:                boolean
}

export interface TrabajoEntity {
    s_plaza_laboral_id?:        number
    s_titulo_oferta?:           string
    s_descripcion_oferta?:      string
    s_cupos_disponibles?:       number
    s_modalidad?:               string
    s_tipo_contratacion?:       string
    s_nombre_empresa?:          string
}
