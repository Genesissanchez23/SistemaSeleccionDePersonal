export interface Cuestionario {
    title:          string
    blocks:         Blocks[]
}

export interface Blocks {
    title:          string
    questions:      Questions[]
}

export interface Questions {
    question:       string
    options:        string[]
}
