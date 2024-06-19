USE SSS_DATABASE;
DELIMITER //
CREATE PROCEDURE pr_postulaciones (
    IN p_opcion INT,
    IN p_postulacion_id INT,
    IN p_usuario_id INT,
    IN p_plaza_laboral_id INT,
    IN p_cv BLOB,
    IN p_estado_solicitud_postulante_id INT
)
BEGIN
    DECLARE v_mensaje VARCHAR(255);
    DECLARE v_estado BOOLEAN DEFAULT false;
    DECLARE conteo INT DEFAULT 0;
    DECLARE conteoE INT DEFAULT 0;
    DECLARE v_estado_solicitud_postulante_id INT DEFAULT 0;
    DECLARE v_estado_solicitud_proceso_id INT DEFAULT 0;
    DECLARE v_estado_solicitud_informacion_id INT DEFAULT 0;
    DECLARE v_estado_solicitud_finalizado_id INT DEFAULT 0;

    -- Obtener estado_solicitud_postulante_id por defecto (estado 'E')
    SELECT estado_solicitud_postulante_id INTO v_estado_solicitud_postulante_id 
    FROM estado_solicitud_postulante 
    WHERE estado = 'E' 
    LIMIT 1;

    -- Obtener estado_solicitud_postulante_id para solicitudes en proceso (estado 'P')
    SELECT estado_solicitud_postulante_id INTO v_estado_solicitud_proceso_id 
    FROM estado_solicitud_postulante 
    WHERE estado = 'P' 
    LIMIT 1;

    -- Obtener estado_solicitud_postulante_id para solicitudes de información personal (estado 'I')
    SELECT estado_solicitud_postulante_id INTO v_estado_solicitud_informacion_id 
    FROM estado_solicitud_postulante 
    WHERE estado = 'I' 
    LIMIT 1;

    -- Obtener estado_solicitud_postulante_id para solicitudes finalizadas (estado 'F')
    SELECT estado_solicitud_postulante_id INTO v_estado_solicitud_finalizado_id 
    FROM estado_solicitud_postulante 
    WHERE estado = 'F' 
    LIMIT 1;

    START TRANSACTION;

    CASE p_opcion
        WHEN 1 THEN
            -- Opción 1: Consultar todos los estados_solicitud_postulante
            BEGIN
                SELECT * FROM estado_solicitud_postulante;
                SET v_estado = true;
            END;

        WHEN 2 THEN
            -- Opción 2: Registrar una postulacion
            IF p_usuario_id IS NOT NULL AND p_plaza_laboral_id IS NOT NULL AND p_cv IS NOT NULL THEN
                BEGIN
                    -- Validar que el usuario no tenga otra postulacion con estado 'E'
                    SELECT COUNT(*) INTO conteoE
                    FROM postulaciones
                    WHERE usuario_id = p_usuario_id AND estado_solicitud_postulante_id = v_estado_solicitud_postulante_id;
    
                    IF conteoE = 0 THEN
                        INSERT INTO postulaciones (usuario_id, plaza_laboral_id, estado_solicitud_postulante_id, cv) 
                        VALUES (p_usuario_id, p_plaza_laboral_id, v_estado_solicitud_postulante_id, p_cv);
                        SET conteo = ROW_COUNT();
                        IF conteo = 1 THEN
                            SELECT "Postulación enviada con éxito." AS v_mensaje;
                            SET v_estado = true;
                        ELSE
                            SELECT "" AS v_mensaje;
                            SET v_estado = false;
                        END IF;
                    ELSE
                        SELECT "Usuario ya tiene una postulación activa." AS v_mensaje;
                        SET v_estado = false;
                    END IF;
                END;
            ELSE
                SELECT "" AS v_mensaje;
                SET v_estado = false;
            END IF;

        WHEN 3 THEN
            -- Opción 3: Consultar todas las postulaciones
            BEGIN
                SELECT p.*, u.alias, du.nombre, du.apellido, pl.titulo_oferta, esp.nombre_estado_solicitud, esp.estado
                FROM postulaciones p
                JOIN usuario u ON p.usuario_id = u.usuario_id
                JOIN datos_personales du ON p.usuario_id = du.usuario_id
                JOIN plaza_laboral pl ON p.plaza_laboral_id = pl.plaza_laboral_id
                JOIN estado_solicitud_postulante esp ON p.estado_solicitud_postulante_id = esp.estado_solicitud_postulante_id;
                SET v_estado = true;
            END;

        WHEN 4 THEN
            -- Opción 4: Consultar todas las postulaciones de un usuario_id específico
            IF p_usuario_id IS NOT NULL THEN
                BEGIN
                    SELECT p.*, u.alias, du.nombre, du.apellido, pl.titulo_oferta, esp.nombre_estado_solicitud, esp.estado
                    FROM postulaciones p
                    JOIN usuario u ON p.usuario_id = u.usuario_id
                    JOIN datos_personales du ON p.usuario_id = du.usuario_id
                    JOIN plaza_laboral pl ON p.plaza_laboral_id = pl.plaza_laboral_id
                    JOIN estado_solicitud_postulante esp ON p.estado_solicitud_postulante_id = esp.estado_solicitud_postulante_id
                    WHERE p.usuario_id = p_usuario_id;
                    SET v_estado = true;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 5 THEN
            -- Opción 5: Modificar postulacion sin permitir cambiar el estado de solicitud
            IF p_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
                    SET 
                        usuario_id = IFNULL(p_usuario_id, usuario_id),
                        plaza_laboral_id = IFNULL(p_plaza_laboral_id, plaza_laboral_id),
                        cv = IFNULL(p_cv, cv)
                    WHERE postulacion_id = p_postulacion_id;
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
            -- Opción 6: Cambiar estado a 'En Proceso'
            IF p_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
                    SET estado_solicitud_postulante_id = v_estado_solicitud_proceso_id
                    WHERE postulacion_id = p_postulacion_id;
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
            -- Opción 7: Cambiar estado a 'Informacion Personal'
            IF p_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
                    SET estado_solicitud_postulante_id = v_estado_solicitud_informacion_id
                    WHERE postulacion_id = p_postulacion_id;
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

        WHEN 8 THEN
            -- Opción 8: Cambiar estado a 'Finalizado'
            IF p_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
                    SET estado_solicitud_postulante_id = v_estado_solicitud_finalizado_id
                    WHERE postulacion_id = p_postulacion_id;
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
