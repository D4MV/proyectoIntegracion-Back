-- Archivo de inicialización de la base de datos
-- Se ejecuta automáticamente cuando se crea el contenedor por primera vez

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Configurar zona horaria
SET timezone = 'UTC';

-- Este archivo se puede usar para crear tablas iniciales, datos de prueba, etc.
-- Por ahora, Prisma se encargará de crear las tablas con las migraciones