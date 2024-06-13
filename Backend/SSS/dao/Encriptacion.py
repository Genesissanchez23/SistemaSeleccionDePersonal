import bcrypt

class Encriptacion:
    @staticmethod
    def encriptar(password: str) -> str:
        # Genera un salt y hashea la contraseña
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    @staticmethod
    def verificar(password: str, hashed_password: str) -> bool:
        # Verifica la contraseña comparándola con el hash almacenado
        return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))
