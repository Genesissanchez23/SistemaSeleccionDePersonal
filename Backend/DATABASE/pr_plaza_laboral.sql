USE SSS_DATABASE;
DELIMITER //
CREATE PROCEDURE pr_plaza_laboral (
    IN s_opcion INT,
    IN s_plaza_laboral_id INT,
    IN s_titulo_oferta VARCHAR(255),
    IN s_descripcion_oferta TEXT,
    IN s_cupos_disponibles INT,
    IN s_modalidad VARCHAR(50),
    IN s_tipo_contratacion VARCHAR(50),
    IN s_nombre_empresa VARCHAR(255),
    IN s_estado CHAR(1)
)
BEGIN
    DECLARE v_mensaje VARCHAR(255);
    DECLARE v_estado BOOLEAN DEFAULT false;
    DECLARE conteo INT DEFAULT 0;

    START TRANSACTION;

    CASE s_opcion
        WHEN 1 THEN
            -- Opción 1: Registrar una nueva plaza laboral
            IF s_titulo_oferta IS NOT NULL AND s_cupos_disponibles IS NOT NULL AND s_modalidad IS NOT NULL AND s_tipo_contratacion IS NOT NULL AND s_descripcion_oferta IS NOT NULL THEN
                BEGIN
                    INSERT INTO plaza_laboral (titulo_oferta, descripcion_oferta, cupos_disponibles, modalidad, tipo_contratacion, nombre_empresa, estado) 
                    VALUES (s_titulo_oferta, s_descripcion_oferta, s_cupos_disponibles, s_modalidad, s_tipo_contratacion, 'Distecom', 'A');
                    SET conteo = ROW_COUNT();
                    IF conteo = 1 THEN
                        SELECT "Plaza laboral registrada con éxito." AS v_mensaje;
                        SET v_estado = true;
                    ELSE
                        SELECT "" AS v_mensaje;
                        SET v_estado = false;
                    END IF;
                END;
            ELSE
                SELECT "" AS v_mensaje;
                SET v_estado = false;
            END IF;

        WHEN 2 THEN
            -- Opción 2: Consultar una plaza laboral por ID
            IF s_plaza_laboral_id IS NOT NULL THEN
                SELECT 
                    plaza_laboral_id AS s_plaza_laboral_id,
                    titulo_oferta AS s_titulo_oferta,
                    descripcion_oferta AS s_descripcion_oferta,
                    cupos_disponibles AS s_cupos_disponibles,
                    modalidad AS s_modalidad,
                    tipo_contratacion AS s_tipo_contratacion,
                    nombre_empresa AS s_nombre_empresa
                FROM plaza_laboral 
                WHERE plaza_laboral_id = s_plaza_laboral_id AND estado = 'A';
                SET v_estado = true;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 3 THEN
            -- Opción 3: Consultar todas las plazas laborales
            BEGIN
                SELECT 
                    plaza_laboral_id AS s_plaza_laboral_id,
                    titulo_oferta AS s_titulo_oferta,
                    descripcion_oferta AS s_descripcion_oferta,
                    cupos_disponibles AS s_cupos_disponibles,
                    modalidad AS s_modalidad,
                    tipo_contratacion AS s_tipo_contratacion,
                    nombre_empresa AS s_nombre_empresa
                FROM plaza_laboral 
                WHERE estado = 'A'
				ORDER BY fecha_ingreso DESC;
                SET v_estado = true;
            END;

        WHEN 4 THEN
            -- Opción 4: Modificar una plaza laboral, sin permitir cambiar el estado
            IF s_plaza_laboral_id IS NOT NULL THEN
                BEGIN
                    UPDATE plaza_laboral
                    SET 
                        titulo_oferta = IFNULL(s_titulo_oferta, titulo_oferta),
                        descripcion_oferta = IFNULL(s_descripcion_oferta, descripcion_oferta),
                        cupos_disponibles = IFNULL(s_cupos_disponibles, cupos_disponibles),
                        modalidad = IFNULL(s_modalidad, modalidad),
                        tipo_contratacion = IFNULL(s_tipo_contratacion, tipo_contratacion),
                        nombre_empresa = 'Distecom'
                    WHERE plaza_laboral_id = s_plaza_laboral_id AND estado = 'A';
                    SET conteo = ROW_COUNT();
                    IF conteo = 1 THEN
                        SELECT "Plaza laboral modificada con éxito." AS v_mensaje;
                        SET v_estado = true;
                    ELSE
                        SELECT "" AS v_mensaje;
                        SET v_estado = false;
                    END IF;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 5 THEN
            -- Opción 5: Eliminar (cambiar el estado de 'A' a 'N') una plaza laboral
            IF s_plaza_laboral_id IS NOT NULL THEN
                BEGIN
                    UPDATE plaza_laboral
                    SET estado = 'N'
                    WHERE plaza_laboral_id = s_plaza_laboral_id AND estado = 'A';
                    SET conteo = ROW_COUNT();
                    IF conteo = 1 THEN
                        SELECT "Plaza laboral eliminada con éxito." AS v_mensaje;
                        SET v_estado = true;
                    ELSE
                        SELECT "" AS v_mensaje;
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
