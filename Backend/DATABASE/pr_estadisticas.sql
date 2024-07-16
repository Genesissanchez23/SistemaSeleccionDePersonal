USE SSS_DATABASE;

DELIMITER //

CREATE PROCEDURE pr_estadisticas(
    IN s_opcion INT
)
BEGIN
    DECLARE v_mensaje VARCHAR(255);
    DECLARE v_estado BOOLEAN DEFAULT false;

    CASE s_opcion
        WHEN 1 THEN
            -- Opción 1: Totales de plazas laborales, empleados, postulantes no finalizados o rechazados
            SELECT 
                (SELECT COUNT(*) FROM plaza_laboral WHERE estado = 'A') AS TOTAL_PLAZAS_LABORALES,
                (SELECT COUNT(*) FROM usuario WHERE tipo_usuario_id = 2 AND estado = 'A') AS TOTAL_EMPLEADOS,
                (SELECT COUNT(*) FROM postulaciones 
                 WHERE estado_solicitud_postulante_id NOT IN (
                    SELECT estado_solicitud_postulante_id FROM estado_solicitud_postulante WHERE estado IN ('F', 'R')
                 )) AS TOTAL_POSTULANTES;
                 
                 SET v_estado = true;
        
        WHEN 2 THEN
            -- Opción 2: Plazas totales y ocupadas por tipo de contratación
			SELECT 
				tipo_contratacion AS name,
				SUM(CASE WHEN estado = 'A' THEN 1 ELSE 0 END) AS "Plazas Activas",
				SUM(CASE WHEN estado = 'N' THEN 1 ELSE 0 END) AS "Plazas Eliminadas"
			FROM plaza_laboral
			GROUP BY tipo_contratacion;

            
            SET v_estado = true;
        
       WHEN 3 THEN
            -- Opción 3: Resumen general
            SELECT 
                'Postulantes Enviadas' AS name, COUNT(*) AS value FROM postulaciones
                WHERE estado_solicitud_postulante_id = (SELECT estado_solicitud_postulante_id FROM estado_solicitud_postulante WHERE estado = 'E')
            UNION ALL
            SELECT 
                'Postulantes En Proceso' AS name, COUNT(*) AS value FROM postulaciones
                WHERE estado_solicitud_postulante_id = (SELECT estado_solicitud_postulante_id FROM estado_solicitud_postulante WHERE estado = 'P')
            UNION ALL
            SELECT 
                'Postulantes Rechazadas' AS name, COUNT(*) AS value FROM postulaciones
                WHERE estado_solicitud_postulante_id = (SELECT estado_solicitud_postulante_id FROM estado_solicitud_postulante WHERE estado = 'R')
            UNION ALL
            SELECT 
                'Solicitudes de Empleados' AS name, COUNT(*) AS value FROM solicitud_empleado;
                
			SET v_estado = true;
        WHEN 4 THEN
            -- Opción 4: Plazas Activas y laborales por Eliminadas
            SELECT 
                modalidad AS name,
				SUM(CASE WHEN estado = 'A' THEN 1 ELSE 0 END) AS "Plazas Activas",
				SUM(CASE WHEN estado = 'N' THEN 1 ELSE 0 END) AS "Plazas Eliminadas"
            FROM plaza_laboral
            GROUP BY modalidad;
            
            SET v_estado = true;
        
        WHEN 5 THEN
            -- Opción 5: Estado de las solicitudes de permisos
            SELECT 
                'Permisos Aceptados' AS name, COUNT(*) AS value FROM solicitud_empleado WHERE estado_solicitud_empleado_id = (SELECT estado_solicitud_empleado_id FROM estado_solicitud_empleado WHERE estado = 'A')
            UNION ALL
            SELECT 
                'Permisos Rechazados' AS name, COUNT(*) AS value FROM solicitud_empleado WHERE estado_solicitud_empleado_id = (SELECT estado_solicitud_empleado_id FROM estado_solicitud_empleado WHERE estado = 'D')
            UNION ALL
            SELECT 
                'Permisos Pendientes' AS name, COUNT(*) AS value FROM solicitud_empleado WHERE estado_solicitud_empleado_id = (SELECT estado_solicitud_empleado_id FROM estado_solicitud_empleado WHERE estado = 'E');
			SET v_estado = true;
        ELSE
            SET v_estado = false;
            SET v_mensaje = 'Opción no válida';
            SELECT v_mensaje AS mensaje;
    END CASE;
END //

DELIMITER ;
