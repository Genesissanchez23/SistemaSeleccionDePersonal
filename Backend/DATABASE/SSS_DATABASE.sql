-- Crear la base de datos
CREATE DATABASE SSS_DATABASE;
-- Configurar la zona horaria de la sesión a Ecuador (-05:00)
SET time_zone = '-05:00';
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
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tipo_usuario_id) REFERENCES tipo_usuario(tipo_usuario_id)
);

-- Crear la tabla datos_personales
CREATE TABLE datos_personales (
    datos_personales_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL ,
    cedula VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    correo VARCHAR(100) NOT NULL,
    usuario_id INT,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id)
);

-- Crear la tabla plaza_laboral
CREATE TABLE plaza_laboral (
    plaza_laboral_id INT AUTO_INCREMENT PRIMARY KEY,
    titulo_oferta VARCHAR(255) NOT NULL,
    descripcion_oferta TEXT,
    cupos_disponibles INT NOT NULL,
    modalidad VARCHAR(50) NOT NULL CHECK (modalidad IN ('Virtual', 'Hibrido', 'Presencial')),
    tipo_contratacion VARCHAR(50) NOT NULL CHECK (tipo_contratacion IN ('Tiempo Completo', 'Medio Tiempo', 'Por Horas')),
    nombre_empresa VARCHAR(255) NOT NULL,
    estado CHAR(1) NOT NULL CHECK (estado IN ('A', 'N')),
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
);


-- Crear la tabla estado_solicitud_empleado
CREATE TABLE estado_solicitud_empleado (
    estado_solicitud_empleado_id INT AUTO_INCREMENT PRIMARY KEY,
    estado CHAR(1) NOT NULL CHECK (estado IN ('E', 'A', 'D')),
    nombre_estado_solicitud VARCHAR(50) NOT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insertar valores por defecto en la tabla estado_solicitud_empleado
INSERT INTO estado_solicitud_empleado (estado, nombre_estado_solicitud) VALUES 
('E', 'Enviado'), 
('A', 'Aceptada'), 
('D', 'Declinada');

-- Crear la tabla tipo_solicitud
CREATE TABLE tipo_solicitud (
    tipo_solicitud_id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crear la tabla solicitud_empleado
CREATE TABLE solicitud_empleado (
    solicitud_empleado_id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT,
    tipo_solicitud_id INT,
    descripcion_solicitud TEXT,
    estado_solicitud_empleado_id INT,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NOT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
    FOREIGN KEY (tipo_solicitud_id) REFERENCES tipo_solicitud(tipo_solicitud_id),
    FOREIGN KEY (estado_solicitud_empleado_id) REFERENCES estado_solicitud_empleado(estado_solicitud_empleado_id)
);


-- Crear la tabla estado_solicitud_postulante
CREATE TABLE estado_solicitud_postulante (
    estado_solicitud_postulante_id INT AUTO_INCREMENT PRIMARY KEY,
    estado CHAR(1) NOT NULL CHECK (estado IN ('E', 'P', 'I', 'F')),
    nombre_estado_solicitud VARCHAR(50) NOT NULL,
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
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
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP,
    cv BLOB, -- Nuevo campo para almacenar el archivo PDF
    FOREIGN KEY (usuario_id) REFERENCES usuario(usuario_id),
    FOREIGN KEY (plaza_laboral_id) REFERENCES plaza_laboral(plaza_laboral_id),
    FOREIGN KEY (estado_solicitud_postulante_id) REFERENCES estado_solicitud_postulante(estado_solicitud_postulante_id)
);


INSERT INTO usuario (alias, contrasena, estado, tipo_usuario_id) 
                    VALUES ('admin', '$2b$12$2rCDwRjQU1TSxszMDuLBG.W6HpWNpqLi3Edu7qUviTsEPnJM26U6m', 'A', 1);
INSERT INTO datos_personales (nombre, apellido, cedula, direccion, correo, usuario_id)
                    VALUES ('admin', 'admin', '0989324569', 'alborada 3era etapa', 'admin@sss.ec', LAST_INSERT_ID());
