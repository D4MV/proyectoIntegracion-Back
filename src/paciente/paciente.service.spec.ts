import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegistroPacDTO } from './DTO/registropac';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

describe('PacienteService', () => {
  let service: PacienteService;

  beforeEach(async () => {
    // Limpia los mocks antes de cada test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debería registrar un paciente nuevo', async () => {
    const dto: RegistroPacDTO = {
      nombre: 'Juan',
      Rut: '12345678-9',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
      fecha_nacimiento: new Date('2000-01-01'),
    };

    // Simula que no existe paciente ni email
    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // Rut
    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // Email
    mockPrisma.user.create.mockResolvedValueOnce({ ...dto, id: '1', role: 'PACIENTE' });

    const result = await service.register(dto);

    expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(2);
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: { ...dto, role: 'PACIENTE' }
    });
    expect(result).toMatchObject({ ...dto, id: '1', role: 'PACIENTE' });
  });

  it('debería lanzar error si el paciente ya existe por Rut', async () => {
    const dto: RegistroPacDTO = {
      nombre: 'Juan',
      Rut: '12345678-9',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
      fecha_nacimiento: new Date('2000-01-01'),
    };

    mockPrisma.user.findUnique.mockResolvedValueOnce({ ...dto }); // Rut existe

    await expect(service.register(dto)).rejects.toThrow('El paciente ya existe');
  });

  it('debería lanzar error si el email ya está en uso', async () => {
    const dto: RegistroPacDTO = {
      nombre: 'Juan',
      Rut: '12345678-9',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
      fecha_nacimiento: new Date('2000-01-01'),
    };

    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // Rut no existe
    mockPrisma.user.findUnique.mockResolvedValueOnce({ ...dto }); // Email existe

    await expect(service.register(dto)).rejects.toThrow('El email ya está en uso');
  });

  it('debería lanzar error si ocurre un error al crear el paciente', async () => {
    const dto: RegistroPacDTO = {
      nombre: 'Juan',
      Rut: '12345678-9',
      apellido: 'Pérez',
      email: 'juan@example.com',
      telefono: '123456789',
      direccion: 'Calle Falsa 123',
      fecha_nacimiento: new Date('2000-01-01'),
    };

    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // Rut
    mockPrisma.user.findUnique.mockResolvedValueOnce(null); // Email
    mockPrisma.user.create.mockRejectedValueOnce(new Error('DB error'));

    await expect(service.register(dto)).rejects.toThrow('Error al crear el pacienteDB error');
  });
});