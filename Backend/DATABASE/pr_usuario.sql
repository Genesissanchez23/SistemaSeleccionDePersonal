USE SSS_DATABASE;
DELIMITER //

CREATE PROCEDURE pr_usuario (
    IN s_opcion INT,
    IN s_alias VARCHAR(50),
    IN s_contrasena VARCHAR(255),
    IN s_estado CHAR(1),
    IN s_tipo_usuario_id INT,
    IN s_nombre VARCHAR(50),
    IN s_apellido VARCHAR(50),
    IN s_cedula VARCHAR(20),
    IN s_direccion VARCHAR(255),
    IN s_correo VARCHAR(100),
    IN s_usuario_id INT
)
BEGIN
    DECLARE v_mensaje VARCHAR(255);
	DECLARE v_estado BOOLEAN DEFAULT false;
    START TRANSACTION;

    CASE s_opcion
        WHEN 1 THEN
            -- Opción 1: Insertar nuevo usuario y datos personales
            IF s_alias IS NOT NULL AND s_contrasena IS NOT NULL AND s_estado IS NOT NULL AND s_tipo_usuario_id IS NOT NULL AND s_nombre IS NOT NULL AND s_apellido IS NOT NULL AND s_cedula IS NOT NULL AND s_direccion IS NOT NULL AND s_correo IS NOT NULL THEN
                BEGIN
                    INSERT INTO usuario (alias, contrasena, estado, tipo_usuario_id) 
                    VALUES (s_alias, s_contrasena, s_estado, s_tipo_usuario_id);
                    
                    SET @last_usuario_id = LAST_INSERT_ID();
                    
                    INSERT INTO datos_personales (nombre, apellido, cedula, direccion, correo, usuario_id)
                    VALUES (s_nombre, s_apellido, s_cedula, s_direccion, s_correo, @last_usuario_id);
                    
                    SET v_mensaje = 'Insertado correctamente';
                    SET v_estado = true;
                END;
            ELSE
				SET v_estado = false;
                SET v_mensaje = 'Datos incompletos para la inserción';
            END IF;

        WHEN 2 THEN
            -- Opción 2: Consultar usuario y datos personales por usuario_id
            IF s_usuario_id IS NOT NULL THEN
                BEGIN
                    SELECT u.*, dp.*
                    FROM usuario u
                    JOIN datos_personales dp ON u.usuario_id = dp.usuario_id
                    WHERE u.usuario_id = s_usuario_id;
                    SET v_estado = true;
                    SET v_mensaje = 'Consulta realizada correctamente';
                END;
            ELSE
				SET v_estado = false;
                SET v_mensaje = 'Falta usuario_id para la consulta';
            END IF;

        WHEN 3 THEN
            -- Opción 3: Consultar usuario y datos personales por alias y contraseña
            IF s_alias IS NOT NULL AND s_contrasena IS NOT NULL THEN
                BEGIN
                    SELECT u.*, dp.*
                    FROM usuario u
                    JOIN datos_personales dp ON u.usuario_id = dp.usuario_id
                    WHERE u.alias = s_alias AND u.contrasena = s_contrasena;
                    SET v_estado = true;
                    SET v_mensaje = 'Consulta realizada correctamente';
                END;
            ELSE
				SET v_estado = false;
                SET v_mensaje = 'Alias y/o contraseña faltantes para la consulta';
            END IF;

        WHEN 4 THEN
            -- Opción 4: Actualizar usuario y datos personales
            IF s_usuario_id IS NOT NULL THEN
                BEGIN
                    UPDATE usuario
                    SET alias = IFNULL(s_alias, alias),
                        contrasena = IFNULL(s_contrasena, contrasena),
                        estado = IFNULL(s_estado, estado),
                        tipo_usuario_id = IFNULL(s_tipo_usuario_id, tipo_usuario_id)
                    WHERE usuario_id = s_usuario_id;
                    
                    UPDATE datos_personales
                    SET nombre = IFNULL(s_nombre, nombre),
                        apellido = IFNULL(s_apellido, apellido),
                        cedula = IFNULL(s_cedula, cedula),
                        direccion = IFNULL(s_direccion, direccion),
                        correo = IFNULL(s_correo, correo)
                    WHERE usuario_id = s_usuario_id;
                    SET v_estado = true;
                    SET v_mensaje = 'Actualización realizada correctamente';
                END;
            ELSE
				SET v_estado = false;
                SET v_mensaje = 'Falta usuario_id para la actualización';
            END IF;

        WHEN 5 THEN
            -- Opción 5: Consultar todos los usuarios y sus datos personales
            BEGIN
                SELECT u.*, dp.*
                FROM usuario u
                JOIN datos_personales dp ON u.usuario_id = dp.usuario_id;
                SET v_estado = true;
                SET v_mensaje = 'Consulta de todos los usuarios realizada correctamente';
            END;

        ELSE
			SET v_estado = false;
            SET v_mensaje = 'Opción no válida';
    END CASE;

    IF v_estado = true THEN
        COMMIT;
    ELSE
        ROLLBACK;
    END IF;

    SELECT v_mensaje AS mensaje;
END //

DELIMITER ;
