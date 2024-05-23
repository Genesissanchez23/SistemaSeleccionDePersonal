from fastapi.security import HTTPAuthorizationCredentials
from jose import JWTError, jwt
from datetime import datetime, timedelta
from environments import api  # Importa la configuración del token desde environments

# Configuración de esquemas de autenticación
from fastapi.security import HTTPBearer

auth_scheme = HTTPBearer()

class Tokenizacion:
    @staticmethod
    def generarToken(data: dict):
        data_copy = data.copy()
        expiration_time = datetime.utcnow() + timedelta(minutes=api.Api.TOKEN_TIME)
        data_copy.update({"exp": expiration_time})
        encoded_token = jwt.encode(data_copy, api.Api.TOKEN_KEY)
        return encoded_token

    @staticmethod
    def mapearToken(credentials: HTTPAuthorizationCredentials = auth_scheme):
        try:
            token_payload = jwt.decode(credentials.credentials, api.Api.TOKEN_KEY, options={"verify_signature": False, "verify_aud": False, "verify_iss": False})
            return token_payload
        except JWTError as error:
            print(error)
            return None

    @staticmethod
    def ValidarToken(credentials: HTTPAuthorizationCredentials = auth_scheme) -> bool:
        token_data = Tokenizacion.mapearToken(credentials)
        if token_data is None:
            return False
        token_expiry = token_data.get("exp")
        if token_expiry:
            expiration_datetime = datetime.utcfromtimestamp(token_expiry)
            if datetime.utcnow() < expiration_datetime:
                return True
        return False
    
acciones = {
    False: {"resultado": "", "mensaje": "Token No es Válido"},
    True: None
}
