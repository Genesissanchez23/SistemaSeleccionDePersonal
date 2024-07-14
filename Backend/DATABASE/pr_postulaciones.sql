USE SSS_DATABASE;
DELIMITER //
CREATE PROCEDURE pr_postulaciones (
    IN s_opcion INT,
    IN s_postulacion_id INT,
    IN s_usuario_id INT,
    IN s_plaza_laboral_id INT,
    IN s_cv BLOB,
    IN s_estado_solicitud_postulante_id INT,
    IN s_fecha_entrevista DATETIME,
    IN s_formulario_entrevista TEXT,
    IN s_telefono VARCHAR(20),
    IN s_cargo VARCHAR(100),
    IN s_banco VARCHAR(30),
    IN s_sueldo DECIMAL(10,2),
    IN s_cuenta_bancaria VARCHAR(50),
    IN s_tipo_sangre VARCHAR(5)
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
    DECLARE v_estado_solicitud_rechazado_id INT DEFAULT 0;
	DECLARE cupos_disponibles_ INT;
    DECLARE postulaciones_finalizadas INT;
    DECLARE id_registro_datos_personales INT DEFAULT NULL;
    
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
    
        -- Obtener estado_solicitud_postulante_id para solicitudes finalizadas (estado 'F')
    SELECT estado_solicitud_postulante_id INTO v_estado_solicitud_rechazado_id 
    FROM estado_solicitud_postulante 
    WHERE estado = 'R' 
    LIMIT 1;

    START TRANSACTION;

    CASE s_opcion
        WHEN 1 THEN
            -- Opción 1: Consultar todos los estados_solicitud_postulante
            BEGIN
                SELECT 
                    estado_solicitud_postulante_id AS s_estado_solicitud_postulante_id,
                    estado AS s_estado,
                    nombre_estado_solicitud AS s_nombre_estado_solicitud,
                    fecha_ingreso AS s_fecha_ingreso
                FROM estado_solicitud_postulante;
                SET v_estado = true;
            END;

        WHEN 2 THEN
            -- Opción 2: Registrar una postulacion
             -- Obtener los cupos disponibles de la plaza laboral
			SELECT cupos_disponibles INTO cupos_disponibles_
			FROM plaza_laboral
			WHERE plaza_laboral_id = s_plaza_laboral_id;

			-- Contar las postulaciones con estado 'F' (Finalizado) en esa plaza laboral
			SELECT COUNT(*) INTO postulaciones_finalizadas
			FROM postulaciones
			WHERE plaza_laboral_id = s_plaza_laboral_id AND estado_solicitud_postulante_id = (SELECT estado_solicitud_postulante_id FROM estado_solicitud_postulante WHERE estado = 'F');

			-- Validar que los cupos disponibles sean mayores que las postulaciones finalizadas
            IF postulaciones_finalizadas < cupos_disponibles_ THEN
				IF s_usuario_id IS NOT NULL AND s_plaza_laboral_id IS NOT NULL AND s_cv IS NOT NULL  THEN
					BEGIN
						-- Validar que el usuario no tenga otra postulacion con estado 'E',ETC
						SELECT COUNT(*) INTO conteoE
						FROM postulaciones
						WHERE usuario_id = s_usuario_id AND estado_solicitud_postulante_id <> v_estado_solicitud_rechazado_id;
		
						IF conteoE = 0 THEN
							INSERT INTO postulaciones (usuario_id, plaza_laboral_id, estado_solicitud_postulante_id, cv) 
							VALUES (s_usuario_id, s_plaza_laboral_id, v_estado_solicitud_postulante_id, s_cv);
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
			ELSE
				SELECT "Plaza laboral sin cupos disponibles" AS v_mensaje;
				SET v_estado = false;
			END IF;

        WHEN 3 THEN
            -- Opción 3: Consultar todas las postulaciones
            BEGIN
                SELECT 
                    p.postulacion_id AS s_postulacion_id,
                    p.usuario_id AS s_usuario_id,
                    p.plaza_laboral_id AS s_plaza_laboral_id,
                    p.estado_solicitud_postulante_id AS s_estado_solicitud_postulante_id,
                    p.fecha_ingreso AS s_fecha_ingreso,
                    p.cv AS s_cv,
                    u.alias AS s_alias,
                    du.nombre AS s_nombre,
                    du.apellido AS s_apellido,
                    pl.titulo_oferta AS s_titulo_oferta,
                    esp.nombre_estado_solicitud AS s_nombre_estado_solicitud,
                    esp.estado AS s_estado,
                    fecha_entrevista as s_fecha_entrevista,
                    id_formulario_datos_personales as s_id_formulario_datos_personales,
                    formulario_entrevista as s_formulario_entrevista
                FROM postulaciones p
                JOIN usuario u ON p.usuario_id = u.usuario_id
                JOIN datos_personales du ON p.usuario_id = du.usuario_id
                JOIN plaza_laboral pl ON p.plaza_laboral_id = pl.plaza_laboral_id
                JOIN estado_solicitud_postulante esp ON p.estado_solicitud_postulante_id = esp.estado_solicitud_postulante_id
				ORDER BY p.fecha_ingreso DESC;
                SET v_estado = true;
            END;

        WHEN 4 THEN
            -- Opción 4: Consultar todas las postulaciones de un usuario_id específico
            IF s_usuario_id IS NOT NULL THEN
                BEGIN
                    SELECT 
                        p.postulacion_id AS s_postulacion_id,
                        p.usuario_id AS s_usuario_id,
                        p.plaza_laboral_id AS s_plaza_laboral_id,
                        p.estado_solicitud_postulante_id AS s_estado_solicitud_postulante_id,
                        p.fecha_ingreso AS s_fecha_ingreso,
                        p.cv AS s_cv,
                        u.alias AS s_alias,
                        du.nombre AS s_nombre,
                        du.apellido AS s_apellido,
                        pl.titulo_oferta AS s_titulo_oferta,
                        esp.nombre_estado_solicitud AS s_nombre_estado_solicitud,
                        esp.estado AS s_estado,
						fecha_entrevista as s_fecha_entrevista,
						id_formulario_datos_personales as s_id_formulario_datos_personales,
						formulario_entrevista as s_formulario_entrevista
                    FROM postulaciones p
                    JOIN usuario u ON p.usuario_id = u.usuario_id
                    JOIN datos_personales du ON p.usuario_id = du.usuario_id
                    JOIN plaza_laboral pl ON p.plaza_laboral_id = pl.plaza_laboral_id
                    JOIN estado_solicitud_postulante esp ON p.estado_solicitud_postulante_id = esp.estado_solicitud_postulante_id
                    WHERE p.usuario_id = s_usuario_id
                    ORDER BY p.fecha_ingreso DESC;
                    SET v_estado = true;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 5 THEN
            -- Opción 5: Modificar postulacion sin permitir cambiar el estado de solicitud
            IF s_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
                    SET 
                        usuario_id = IFNULL(s_usuario_id, usuario_id),
                        plaza_laboral_id = IFNULL(s_plaza_laboral_id, plaza_laboral_id),
                        cv = IFNULL(s_cv, cv)
                    WHERE postulacion_id = s_postulacion_id;
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
            IF s_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
                    SET estado_solicitud_postulante_id = v_estado_solicitud_proceso_id 
						, fecha_entrevista = s_fecha_entrevista
                    WHERE postulacion_id = s_postulacion_id;
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
            IF s_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
                    SET estado_solicitud_postulante_id = v_estado_solicitud_informacion_id
                    WHERE postulacion_id = s_postulacion_id;
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
            -- Opción 11: Registrar formulario de datos personales y actualizar la postulación
			IF s_postulacion_id IS NOT NULL THEN
				BEGIN
					-- Validar que los campos no estén vacíos
					IF s_telefono IS NOT NULL AND s_cargo IS NOT NULL AND s_sueldo IS NOT NULL AND s_banco IS NOT NULL AND s_cuenta_bancaria IS NOT NULL AND s_tipo_sangre IS NOT NULL THEN
						BEGIN
							-- Insertar el nuevo registro en la tabla formulario_datos_personales
							INSERT INTO formulario_datos_personales (telefono, cargo, sueldo, banco, cuenta_bancaria, tipo_sangre)
							VALUES (s_telefono, s_cargo, s_sueldo, s_banco, s_cuenta_bancaria, s_tipo_sangre);

							-- Obtener el ID del nuevo registro
							SET id_registro_datos_personales = LAST_INSERT_ID();

							-- Validar que el registro se realizó correctamente
							IF id_registro_datos_personales IS NOT NULL THEN
								BEGIN
									-- Actualizar la postulación con el formulario de datos personales
									UPDATE postulaciones
									SET estado_solicitud_postulante_id = v_estado_solicitud_finalizado_id,
										id_formulario_datos_personales = id_registro_datos_personales
									WHERE postulacion_id = s_postulacion_id;
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
						END;
					ELSE
						SET v_estado = false;
					END IF;
				END;
			ELSE
				SET v_estado = false;
			END IF;
		 WHEN 9 THEN
            -- Opción 9: Cambiar estado a 'Rechazado'
            IF s_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
                    SET estado_solicitud_postulante_id = v_estado_solicitud_rechazado_id,
						id_formulario_datos_personales = s_id_formulario_datos_personales,
                        fecha_entrevista = NULL
                    WHERE postulacion_id = s_postulacion_id;
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
		WHEN 10 THEN
            -- Opción 10: Consultar todas las postulaciones de un plaza_laboral_id específico
            IF s_plaza_laboral_id IS NOT NULL THEN
                BEGIN
                    SELECT 
                        p.postulacion_id AS s_postulacion_id,
                        p.usuario_id AS s_usuario_id,
                        p.plaza_laboral_id AS s_plaza_laboral_id,
                        p.estado_solicitud_postulante_id AS s_estado_solicitud_postulante_id,
                        p.fecha_ingreso AS s_fecha_ingreso,
                        p.cv AS s_cv,
                        u.alias AS s_alias,
                        du.nombre AS s_nombre,
                        du.apellido AS s_apellido,
                        pl.titulo_oferta AS s_titulo_oferta,
                        esp.nombre_estado_solicitud AS s_nombre_estado_solicitud,
                        esp.estado AS s_estado,
						fecha_entrevista as s_fecha_entrevista,
						id_formulario_datos_personales as s_id_formulario_datos_personales,
						formulario_entrevista as s_formulario_entrevista
                    FROM postulaciones p
                    JOIN usuario u ON p.usuario_id = u.usuario_id
                    JOIN datos_personales du ON p.usuario_id = du.usuario_id
                    JOIN plaza_laboral pl ON p.plaza_laboral_id = pl.plaza_laboral_id
                    JOIN estado_solicitud_postulante esp ON p.estado_solicitud_postulante_id = esp.estado_solicitud_postulante_id
                    WHERE p.plaza_laboral_id = s_plaza_laboral_id
                    ORDER BY p.fecha_ingreso DESC;
                    SET v_estado = true;
                END;
            ELSE
                SET v_estado = false;
            END IF;
		
		WHEN 11 THEN
        -- enviar entrervista
			IF s_postulacion_id IS NOT NULL THEN
                BEGIN
                    UPDATE postulaciones
					SET formulario_entrevista = s_formulario_entrevista
					WHERE postulacion_id = s_postulacion_id;
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
		WHEN 12 THEN
        -- ver formulario asociado a una postulacion
			IF s_postulacion_id IS NOT NULL THEN
                BEGIN
                   SELECT telefono,cargo,sueldo,banco,cuenta_bancaria,tipo_sangre 
                   FROM SSS_DATABASE.formulario_datos_personales f
                   join postulaciones p ON p.id_formulario_datos_personales = f.formulario_datos_personales_id
                   WHERE p.postulacion_id = s_postulacion_id;
                   SET v_estado = true;
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
