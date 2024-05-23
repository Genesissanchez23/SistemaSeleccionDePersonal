-- Crear la base de datos
CREATE DATABASE SSS_DATABASE;

-- Usar la base de datos creada
USE SSS_DATABASE;

-- Crear la tabla tipo_usuario
CREATE TABLE tipo_usuario (
    tipo_usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL
);

-- Insertar valores por defecto en la tabla tipo_usuario
INSERT INTO tipo_usuario (tipo) VALUES ('Administrador'), ('Empleado'), ('Postulante');

-- Crear la tabla usuario
CREATE TABLE usuario (
    usuario_id INT AUTO_INCREMENT PRIMARY KEY,
    alias VARCHAR(50) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    estado CHAR(1) NOT NULL CHECK (estado IN ('A', 'N')),
    tipo_usuario_id INT,
    FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario(tipo_usuario_id)
);

-- Crear la tabla datos_personales
CREATE TABLE datos_personales (
    datos_personales_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    usuario_id INT,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);

-- Crear la tabla provincia
CREATE TABLE provincia (
    provincia_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);

-- Insertar valores por defecto en la tabla provincia
INSERT INTO provincia (nombre) VALUES 
('Azuay'), ('Bolívar'), ('Cañar'), ('Carchi'), ('Chimborazo'), ('Cotopaxi'), ('El Oro'), ('Esmeraldas'), 
('Galápagos'), ('Guayas'), ('Imbabura'), ('Loja'), ('Los Ríos'), ('Manabí'), ('Morona Santiago'), 
('Napo'), ('Orellana'), ('Pastaza'), ('Pichincha'), ('Santa Elena'), ('Santo Domingo de los Tsáchilas'), 
('Sucumbíos'), ('Tungurahua'), ('Zamora Chinchipe');

-- Crear la tabla ciudad
CREATE TABLE ciudad (
    ciudad_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    provincia_id INT,
    FOREIGN KEY (provincia_id) REFERENCES provincia(provincia_id)
);

-- Insertar valores por defecto en la tabla ciudad
-- Aquí deberías insertar los nombres de las 47 ciudades y sus respectivas provincias. 
INSERT INTO ciudad (nombre, provincia_id) VALUES 
('Guaranda', 2),
('Tulcán', 4),
('Riobamba', 5),
('Latacunga', 6),
('Machala', 7),
('Esmeraldas', 8),
('Puerto Baquerizo Moreno', 9),
('Guayaquil', 10),
('Ibarra', 11),
('Loja', 12),
('Babahoyo', 13),
('Portoviejo', 14),
('Macas', 15),
('Tena', 16),
('Francisco de Orellana', 17),
('Puyo', 18),
('Quito', 19),
('Santa Elena', 20),
('Santo Domingo', 21),
('Nueva Loja', 22),
('Ambato', 23),
('Zamora', 24),
('Cuenca', 1),
('Azogues', 3),
('Cayambe', 19),
('Latacunga', 6),
('Salcedo', 6),
('La Maná', 6),
('Quevedo', 13),
('Manta', 14),
('Montecristi', 14),
('Chone', 14),
('Rocafuerte', 14),
('Jipijapa', 14),
('Bahía de Caráquez', 14),
('Portoviejo', 14),
('Sucre', 14),
('Pedernales', 14),
('Jama', 14),
('Flavio Alfaro', 14),
('Paján', 14),
('Pichincha', 14),
('San Vicente', 14),
('Puerto López', 14),
('Santa Ana', 14),
('Manta', 14),
('Montecristi', 14),
('Chone', 14),
('El Carmen', 14),
('Portoviejo', 14),
('Portoviejo', 14),
('Chone', 14),
('Santa Ana', 14),
('Olmedo', 14),
('24 de Mayo', 14),
('Paján', 14),
('Jipijapa', 14),
('Puerto López', 14),
('Jama', 14),
('Pedernales', 14),
('Sucre', 14),
('Rocafuerte', 14),
('Bahía de Caráquez', 14),
('San Vicente', 14),
('Cañar', 3),
('La Troncal', 3),
('Azogues', 3),
('Guayaquil', 10),
('Durán', 10),
('Samborondón', 10),
('Milagro', 10),
('Playas', 10),
('Salinas', 10),
('General Villamil', 10),
('San Jacinto de Buena Fé', 13),
('Puebloviejo', 13),
('Vinces', 13),
('Urdaneta', 13),
('Ventanas', 13),
('Baba', 13),
('Montalvo', 13),
('Palenque', 13),
('Quevedo', 13),
('Quinsaloma', 13),
('Valencia', 13),
('Macará', 12),
('Loja', 12),
('Catamayo', 12),
('Calvas', 12),
('Chaguarpamba', 12),
('Espíndola', 12),
('Gonzanamá', 12),
('Paltas', 12),
('Puyango', 12),
('Saraguro', 12),
('Sozoranga', 12),
('Zapotillo', 12),
('Celica', 12),
('Olmedo', 12),
('Quilanga', 12),
('Chaguarpamba', 12),
('Pindal', 12),
('Yacuambi', 24),
('Yantzaza', 24),
('Zamora', 24),
('El Pangui', 24),
('Centinela del Cóndor', 24),
('Nangaritza', 24),
('Palanda', 24),
('Paquisha', 24),
('Guayaquil', 10),
('Cuenca', 1),
('Ibarra', 11),
('Otavalo', 11),
('Antonio Ante', 11),
('Cotacachi', 11),
('San Miguel de Urcuquí', 11),
('Quito', 19),
('Mejía', 19),
('Rumiñahui', 19),
('Pedro Moncayo', 19),
('Cayambe', 19),
('Pedro Vicente Maldonado', 19),
('Puerto Quito', 19),
('Santo Domingo', 21),
('La Concordia', 21),
('Ambato', 23),
('Baños', 23),
('Cevallos', 23),
('Mocha', 23),
('Patate', 23),
('Pelileo', 23),
('Pillaro', 23),
('Quero', 23),
('Tisaleo', 23);

-- Crear la tabla plaza_laboral
CREATE TABLE plaza_laboral (
    plaza_laboral_id INT AUTO_INCREMENT PRIMARY KEY,
    titulo_oferta VARCHAR(255) NOT NULL,
    descripcion_oferta TEXT,
    cupos_disponibles INT NOT NULL,
    provincia_id INT,
    ciudad_id INT,
    modalidad VARCHAR(50) NOT NULL CHECK (modalidad IN ('Virtual', 'Hibrido', 'Presencial')),
    tipo_contratacion VARCHAR(50) NOT NULL CHECK (tipo_contratacion IN ('Tiempo Completo', 'Medio Tiempo', 'Por Horas')),
    nombre_empresa VARCHAR(255) NOT NULL,
    estado CHAR(1) NOT NULL CHECK (estado IN ('A', 'N')),
    FOREIGN KEY (provincia_id) REFERENCES provincia(provincia_id),
    FOREIGN KEY (ciudad_id) REFERENCES ciudad(ciudad_id)
);


-- Crear la tabla estado_solicitud_empleado
CREATE TABLE estado_solicitud_empleado (
    estado_solicitud_empleado_id INT AUTO_INCREMENT PRIMARY KEY,
    estado CHAR(1) NOT NULL CHECK (estado IN ('E', 'A', 'D')),
    nombre_estado_solicitud VARCHAR(50) NOT NULL
);

-- Insertar valores por defecto en la tabla estado_solicitud_empleado
INSERT INTO estado_solicitud_empleado (estado, nombre_estado_solicitud) VALUES 
('E', 'Enviado'), 
('A', 'Aceptada'), 
('D', 'Declinada');

-- Crear la tabla tipo_solicitud
CREATE TABLE tipo_solicitud (
    tipo_solicitud_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL
);

-- Crear la tabla solicitud_empleado
CREATE TABLE solicitud_empleado (
    solicitud_empleado_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    tipo_solicitud_id INT,
    descripcion_solicitud TEXT,
    estado_solicitud_empleado_id INT,
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
    FOREIGN KEY (tipo_solicitud_id) REFERENCES tipo_solicitud(tipo_solicitud_id),
    FOREIGN KEY (estado_solicitud_empleado_id) REFERENCES estado_solicitud_empleado(estado_solicitud_empleado_id)
);

-- Crear la tabla estado_solicitud_postulante
CREATE TABLE estado_solicitud_postulante (
    estado_solicitud_postulante_id INT AUTO_INCREMENT PRIMARY KEY,
    estado CHAR(1) NOT NULL CHECK (estado IN ('E', 'P', 'I', 'F')),
    nombre_estado_solicitud VARCHAR(50) NOT NULL
);

-- Insertar valores por defecto en la tabla estado_solicitud_postulante
INSERT INTO estado_solicitud_postulante (estado, nombre_estado_solicitud) VALUES 
('E', 'Enviado'), 
('P', 'En Proceso'), 
('I', 'Informacion Personal'), 
('F', 'Finalizado');

-- Crear la tabla postulaciones
CREATE TABLE postulaciones (
    postulacion_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    plaza_laboral_id INT,
    estado_solicitud_postulante_id INT,
    cv BLOB, -- Nuevo campo para almacenar el archivo PDF
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
    FOREIGN KEY (plaza_laboral_id) REFERENCES plaza_laboral(plaza_laboral_id),
    FOREIGN KEY (estado_solicitud_postulante_id) REFERENCES estado_solicitud_postulante(estado_solicitud_postulante_id)
);

