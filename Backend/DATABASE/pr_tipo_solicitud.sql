USE SSS_DATABASE;
DELIMITER //

CREATE PROCEDURE pr_tipo_solicitud (
    IN s_opcion INT,
    IN s_tipo_solicitud_id INT,
    IN s_tipo VARCHAR(50)
)
BEGIN
    DECLARE v_mensaje VARCHAR(255);
    DECLARE v_estado BOOLEAN DEFAULT false;
    DECLARE conteo INT DEFAULT 0;
    START TRANSACTION;

    CASE s_opcion
        WHEN 1 THEN
            -- Opción 1: Consultar tipo de solicitud por ID
            IF s_tipo_solicitud_id IS NOT NULL THEN
                BEGIN
                    SELECT * FROM tipo_solicitud WHERE tipo_solicitud_id = s_tipo_solicitud_id;
                    SET v_estado = true;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 2 THEN
            -- Opción 2: Consultar tipo de solicitud por tipo
            IF s_tipo IS NOT NULL THEN
                BEGIN
                    SELECT * FROM tipo_solicitud WHERE tipo LIKE CONCAT("%" , s_tipo , "%");
                    SET v_estado = true;
                END;
            ELSE
                SET v_estado = false;
            END IF;

        WHEN 3 THEN
            -- Opción 3: Consultar todos los tipos de solicitud
            BEGIN
                SELECT * FROM tipo_solicitud;
                SET v_estado = true;
            END;

        WHEN 4 THEN
            -- Opción 4: Registrar nuevo tipo de solicitud
            IF s_tipo IS NOT NULL THEN
                BEGIN
                    INSERT INTO tipo_solicitud (tipo) VALUES (s_tipo);
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
