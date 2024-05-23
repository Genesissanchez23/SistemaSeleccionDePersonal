from environments import Bd  
import aiomysql

async def conectar():
    conn = await aiomysql.connect(host=Bd.Bd.HOST, user=Bd.Bd.DATABASE_USER, password=Bd.Bd.DATABASE_PASS, db=Bd.Bd.DATABASE, charset='utf8', cursorclass=aiomysql.DictCursor)
    return conn