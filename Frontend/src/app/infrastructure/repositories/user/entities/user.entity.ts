export interface ResponseData {
    resultado:              UserEntity | UserEntity[] | string,
    mensaje:                boolean
}

export interface UserEntity {
    s_usuario_id?:          number
    s_nombre?:              string
    s_apellido?:            string
    s_cedula?:              string
    s_correo?:              string
    s_direccion?:           string
    s_tipo_usuario_id?:     number
    s_tipo_usuario?:        string
    s_alias?:               string
    s_contrasena?:          string
}