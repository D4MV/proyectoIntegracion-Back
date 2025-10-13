-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DOCTOR', 'PACIENTE');

-- CreateEnum
CREATE TYPE "Genero" AS ENUM ('MASCULINO', 'FEMENINO', 'OTRO');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "Rut" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT,
    "fecha_nacimiento" TIMESTAMP(3) NOT NULL,
    "genero" "Genero",
    "descripcion_profesional" TEXT,
    "calificacion_promedio" DECIMAL(3,2),
    "prevision_salud" TEXT,
    "antecedentes_medicos" TEXT,
    "latitud" DECIMAL(10,8),
    "longitud" DECIMAL(11,8),
    "ultima_actualizacion_ubicacion" TIMESTAMP(3),
    "role" "Role" NOT NULL DEFAULT 'PACIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cita" (
    "id" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "pacienteId" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'DISPONIBLE',

    CONSTRAINT "Cita_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_Rut_key" ON "users"("Rut");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Cita_doctorId_fecha_horaInicio_key" ON "Cita"("doctorId", "fecha", "horaInicio");

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cita" ADD CONSTRAINT "Cita_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
