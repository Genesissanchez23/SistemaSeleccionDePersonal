export interface PostulacionModel {
    id?:                    number
    aspiranteId?:           number
    aspiranteNombres?:      string
    aspiranteApellidos?:    string
    plazaLaboralId?:        number
    plazaLaboralNombre?:    string
    curriculum?:            File  
    estadoId?:              number
    estadoChar?:            string
    estadoNombre?:          string
    fechaReg?:              Date
    fechaEntrevista?:       Date      
    formularioEntrevista?:  string
}
