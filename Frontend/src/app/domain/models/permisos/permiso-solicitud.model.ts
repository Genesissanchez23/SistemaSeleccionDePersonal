export interface PermisoSolicitudModel {
    id?:                    number
    usuarioId?:             number
    nombres?:               string
    permisoTipoId?:         number
    permisoTipo?:           string
    descripcion?:           string
    fechaRegistro?:         Date
    fechaInicioPermiso?:    Date
    fechaFinPermiso?:       Date
    estado?:                string
    descripcionEstado?:     string
}
 