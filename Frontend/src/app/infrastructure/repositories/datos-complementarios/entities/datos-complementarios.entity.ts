export interface ResponseData {
    resultado:              DatosComplementariosEntity[]
    mensaje:                boolean
}

export interface DatosComplementariosEntity {
    s_postulacion_id?:      number
    s_telefono?:            string
    s_cargo?:               string
    s_cuenta_bancaria?:     string
    s_tipo_sangre?:         string
    s_banco?:               string
}
