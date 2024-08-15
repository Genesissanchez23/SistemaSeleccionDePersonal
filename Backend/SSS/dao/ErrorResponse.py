import re

# Define el diccionario de traducciones
traducciones = {
    "Duplicate entry ": "duplicado"
}

traducciones2 = {
    "usuario.alias": "Usuario duplicado",
    "datos_personales.cedula": "Cedula duplicado"
}

def extraer_mensaje_error(error_message):
    print(error_message)
    pattern = r'\(\d+,\s+"([^"]+)"\)'
    
    # Utiliza re.search para encontrar el patrón y extraer el mensaje
    match = re.search(pattern, error_message)
    
    if match:
        mensaje_extraido = match.group(1)
        
        # Busca el mensaje en el diccionario de traducciones
        for key, value in traducciones.items():
            if key in mensaje_extraido:
                for key, value in traducciones2.items():
                    if key in mensaje_extraido:
                        return value
        
        # Si el mensaje no está en el diccionario, devuelve el mensaje original
        return mensaje_extraido
    else:
        return None
