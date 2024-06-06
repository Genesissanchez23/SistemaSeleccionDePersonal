export interface Respuesta {
    resultado:              RolEntity[],
    mensaje:                boolean
}

export interface RolEntity {
    s_tipo_usuario_id?:     number
    s_tipo?:                string
}
