DELIMITER //
USE SSS_DATABASE;
CREATE PROCEDURE pr_solicitud_empleado (
    IN s_opcion INT,
    IN s_solicitud_empleado_id INT,
    IN s_usuario_id INT,
    IN s_tipo_solicitud_id INT,
    IN s_descripcion_solicitud TEXT,
    IN s_estado_solicitud_empleado_id INT,
    IN s_fecha_inicio DATETIME,
    IN s_fecha_fin DATETIME
)
BEGIN
    DECLARE v_mensaje VARCHAR(255);
    DECLARE v_estado BOOLEAN DEFAULT false;
    DECLARE conteo INT DEFAULT 0;
    DECLARE conteoE INT DEFAULT 0;
    DECLARE v_estado_solicitud_empleado_id INT DEFAULT 0;
    DECLARE v_estado_solicitud_aceptada_id INT DEFAULT 0;
    DECLARE v_estado_solicitud_declinada_id INT DEFAULT 0;

    -- Obtener estado_solicitud_empleado_id por defecto (estado 'E')
    SELECT estado_solicitud_empleado_id INTO v_estado_solicitud_empleado_id 
    FROM estado_solicitud_empleado 
    WHERE estado = 'E' 
    LIMIT 1;

    -- Obtener estado_solicitud_empleado_id para solicitudes aceptadas (estado 'A')
    SELECT estado_solicitud_empleado_id INTO v_estado_solicitud_aceptada_id 
    FROM estado_solicitud_empleado 
    WHERE estado = 'A' 
    LIMIT 1;

    -- Obtener estado_solicitud_empleado_id para solicitudes declinadas (estado 'D')
    SELECT estado_solicitud_empleado_id INTO v_estado_solicitud_declinada_id 
    FROM estado_solicitud_empleado 
    WHERE estado = 'D' 
    LIMIT 1;

    START TRANSACTION;

    CASE s_opcion
        WHEN 1 THEN
            -- Opción 1: Consultar todos los estados_solicitud empleado
            BEGIN
                SELECT * FROM estado_solicitud_empleado;
                SET v_estado = true;
            END;

        WHEN 2 THEN
            -- Opción 2: Registrar una solicitud_empleado
            IF s_usuario_id IS NOT NULL AND s_tipo_solicitud_id IS NOT NULL AND s_fecha_inicio IS NOT NULL AND s_fecha_fin IS NOT NULL THEN
                BEGIN
                    -- Validar que el usuario no tenga otra solicitud con estado 'E'
                    SELECT COUNT(*) INTO conteoE
                    FROM solicitud_empleado
                    WHERE usuario_id = s_usuario_id AND estado_solicitud_empleado_id = v_estado_solicitud_empleado_id;
	
                    IF conteoE = 0 THEN
                        INSERT INTO solicitud_empleado (usuario_id, tipo_solicitud_id, descripcion_solicitud, estado_solicitud_empleado_id, fecha_inicio, fecha_fin) 
                        VALUES (s_usuario_id, s_tipo_solicitud_id, s_descripcion_solicitud, v_estado_solicitud_empleado_id , s_fecha_inicio, s_fecha_fin);
                        SET conteo = ROW_COUNT();
                        IF conteo = 1 THEN
							select "Solicitud enviada con exito." as v_mensaje;
                            SET v_estado = true;
                        ELSE
							select "" as v_mensaje;
                            SET v_estado = false;
                        END IF;
                    ELSE
						select "Usuario ya tiene una solicitud Activa." as v_mensaje;
                        SET v_estado = false;
                    END IF;
                END;
            ELSE
				select "" as v_mensaje;
                SET v_estado = false;
            END IF;

        WHEN 3 THEN
            -- Opción 3: Consultar todas las solicitud_empleado
            BEGIN
                SELECT se.*, ts.tipo, ese.nombre_estado_solicitud ,ese.estado
                FROM solicitud_empleado se
                JOIN tipo_solicitud ts ON se.tipo_solicitud_id = ts.tipo_solicitud_id
                JOIN estado_solicitud_empleado ese ON se.estado_solicitud_empleado_id = ese.estado_solicitud_empleado_id;
                SET v_estado = true;
            END;

        WHEN 4 THEN
            -- Opción 4: Consultar todas las solicitud_empleado de un usuario_id específico
            IF s_usuario_id IS NOT NULL THEN
                BEGIN
                    SELECT se.*, ts.tipo, ese.nombre_estado_solicitud, ese.estado
                    FROM solicitud_empleado se
                    JOIN tipo_solicitud ts ON se.tipo_solicitud_id = ts.tipo_solicitud_id
                    JOIN estado_solicitud_empleado ese ON se.estado_solicitud_empleado_id = ese.estado_solicitud_empleado_id
                    WHERE se.usuario_id = s_usuario_id;
                    SET v_estado = true;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 5 THEN
            -- Opción 5: Modificar solicitud_empleado
            IF s_solicitud_empleado_id IS NOT NULL THEN
                BEGIN
                    UPDATE solicitud_empleado
                    SET 
                        usuario_id = IFNULL(s_usuario_id, usuario_id),
                        tipo_solicitud_id = IFNULL(s_tipo_solicitud_id, tipo_solicitud_id),
                        descripcion_solicitud = IFNULL(s_descripcion_solicitud, descripcion_solicitud),
                        fecha_inicio = IFNULL(s_fecha_inicio, fecha_inicio),
                        fecha_fin = IFNULL(s_fecha_fin, fecha_fin)
                    WHERE solicitud_empleado_id = s_solicitud_empleado_id;
                    SET conteo = ROW_COUNT();
                    IF conteo = 1 THEN
                        SET v_estado = true;
                    ELSE
                        SET v_estado = false;
                    END IF;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 6 THEN
            -- Opción 6: Aceptar solicitud_empleado
            IF s_solicitud_empleado_id IS NOT NULL THEN
                BEGIN
                    UPDATE solicitud_empleado
                    SET estado_solicitud_empleado_id = v_estado_solicitud_aceptada_id
                    WHERE solicitud_empleado_id = s_solicitud_empleado_id;
                    SET conteo = ROW_COUNT();
                    IF conteo = 1 THEN
                        SET v_estado = true;
                    ELSE
                        SET v_estado = false;
                    END IF;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 7 THEN
            -- Opción 7: Declinada solicitud_empleado
            IF s_solicitud_empleado_id IS NOT NULL THEN
                BEGIN
                    UPDATE solicitud_empleado
                    SET estado_solicitud_empleado_id = v_estado_solicitud_declinada_id
                    WHERE solicitud_empleado_id = s_solicitud_empleado_id;
                    SET conteo = ROW_COUNT();
                    IF conteo = 1 THEN
                        SET v_estado = true;
                    ELSE
                        SET v_estado = false;
                    END IF;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        ELSE
            SET v_estado = false;
    END CASE;

    IF v_estado = true THEN
        COMMIT;
    ELSE
        ROLLBACK;
    END IF;

    SELECT v_estado AS mensaje;
END //

DELIMITER ;
