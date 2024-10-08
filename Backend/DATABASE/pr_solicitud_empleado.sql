USE SSS_DATABASE;
DELIMITER //
CREATE PROCEDURE pr_solicitud_empleado (
    IN s_opcion INT,
    IN s_solicitud_empleado_id INT,
    IN s_usuario_id INT,
    IN s_tipo_solicitud_id INT,
    IN s_descripcion_solicitud TEXT,
    IN s_estado_solicitud_empleado_id INT,
    IN s_fecha_inicio DATETIME,
    IN s_fecha_fin DATETIME,
    IN s_certificado BLOB
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
                SELECT 
                    estado_solicitud_empleado_id AS s_estado_solicitud_empleado_id,
                    estado AS s_estado,
                    nombre_estado_solicitud AS s_nombre_estado_solicitud,
                    fecha_ingreso AS s_fecha_ingreso
                FROM estado_solicitud_empleado;
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
                        INSERT INTO solicitud_empleado (usuario_id, tipo_solicitud_id, descripcion_solicitud, estado_solicitud_empleado_id, fecha_inicio, fecha_fin,certificado) 
                        VALUES (s_usuario_id, s_tipo_solicitud_id, s_descripcion_solicitud, v_estado_solicitud_empleado_id , s_fecha_inicio, s_fecha_fin,s_certificado);
                        SET conteo = ROW_COUNT();
                        IF conteo = 1 THEN
                            SELECT "Solicitud enviada con exito." AS v_mensaje;
                            SET v_estado = true;
                        ELSE
                            SELECT "" AS v_mensaje;
                            SET v_estado = false;
                        END IF;
                    ELSE
                        SELECT "Usuario ya tiene una solicitud Activa." AS v_mensaje;
                        SET v_estado = false;
                    END IF;
                END;
            ELSE
                SELECT "" AS v_mensaje;
                SET v_estado = false;
            END IF;

        WHEN 3 THEN
            -- Opción 3: Consultar todas las solicitud_empleado
            BEGIN
                SELECT 
                    se.solicitud_empleado_id AS s_solicitud_empleado_id,
                    se.usuario_id AS s_usuario_id,
                    se.tipo_solicitud_id AS s_tipo_solicitud_id,
                    se.descripcion_solicitud AS s_descripcion_solicitud,
                    se.estado_solicitud_empleado_id AS s_estado_solicitud_empleado_id,
                    se.fecha_inicio AS s_fecha_inicio,
                    se.fecha_fin AS s_fecha_fin,
                    se.fecha_ingreso AS s_fecha_ingreso,
                    dt.nombre AS s_nombre,
                    dt.apellido AS s_apellido,
                    ts.tipo AS s_tipo,
                    ese.nombre_estado_solicitud AS s_nombre_estado_solicitud,
                    ese.estado AS s_estado,
                    se.certificado as s_certificado
                FROM solicitud_empleado se
                JOIN tipo_solicitud ts ON se.tipo_solicitud_id = ts.tipo_solicitud_id
                JOIN estado_solicitud_empleado ese ON se.estado_solicitud_empleado_id = ese.estado_solicitud_empleado_id
                JOIN datos_personales dt ON se.usuario_id = dt.usuario_id;
                SET v_estado = true;
            END;

        WHEN 4 THEN
            -- Opción 4: Consultar todas las solicitud_empleado de un usuario_id específico
            IF s_usuario_id IS NOT NULL THEN
                BEGIN
                    SELECT 
                        se.solicitud_empleado_id AS s_solicitud_empleado_id,
                        se.usuario_id AS s_usuario_id,
                        se.tipo_solicitud_id AS s_tipo_solicitud_id,
                        se.descripcion_solicitud AS s_descripcion_solicitud,
                        se.estado_solicitud_empleado_id AS s_estado_solicitud_empleado_id,
                        se.fecha_inicio AS s_fecha_inicio,
                        se.fecha_fin AS s_fecha_fin,
                        se.fecha_ingreso AS s_fecha_ingreso,
                        dt.nombre AS s_nombre,
                        dt.apellido AS s_apellido,
                        ts.tipo AS s_tipo,
                        ese.nombre_estado_solicitud AS s_nombre_estado_solicitud,
                        ese.estado AS s_estado,
						se.certificado as s_certificado
                    FROM solicitud_empleado se
                    JOIN tipo_solicitud ts ON se.tipo_solicitud_id = ts.tipo_solicitud_id
                    JOIN estado_solicitud_empleado ese ON se.estado_solicitud_empleado_id = ese.estado_solicitud_empleado_id
                    JOIN datos_personales dt ON se.usuario_id = dt.usuario_id
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
