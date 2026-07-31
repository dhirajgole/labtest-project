from db.postgres import get_connection

conn = get_connection()

cursor = conn.cursor()

cursor.execute("SELECT NOW();")

print(cursor.fetchone())