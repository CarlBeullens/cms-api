import { PrismaClient, FileStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      password: 'hashed_password_123',
      name: 'John Doe',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      password: 'hashed_password_456',
      name: 'Jane Smith',
    },
  });

  console.log('✅ Created users:', { user1: user1.email, user2: user2.email });

  const file1 = await prisma.file.create({
    data: {
      filename: 'vacation-photo.jpg',
      originalName: 'IMG_1234.jpg',
      mimeType: 'image/jpeg',
      size: 2548000,
      storageKey: 'uploads/2025/vacation-photo.jpg',
      status: FileStatus.READY,
      userId: user1.id,
    },
  });

  const file2 = await prisma.file.create({
    data: {
      filename: 'report-2025.pdf',
      originalName: 'Annual_Report.pdf',
      mimeType: 'application/pdf',
      size: 1024000,
      storageKey: 'uploads/2025/report.pdf',
      status: FileStatus.PROCESSING,
      userId: user1.id,
    },
  });

  const file3 = await prisma.file.create({
    data: {
      filename: 'presentation.pptx',
      originalName: 'Q1_Presentation.pptx',
      mimeType: 'application/pptx',
      size: 5120000,
      storageKey: 'uploads/2025/presentation.pptx',
      status: FileStatus.READY,
      userId: user1.id,
    },
  });

  const file4 = await prisma.file.create({
    data: {
      filename: 'profile-pic.png',
      originalName: 'avatar.png',
      mimeType: 'image/png',
      size: 512000,
      storageKey: 'uploads/2025/profile.png',
      status: FileStatus.READY,
      userId: user2.id,
    },
  });

  const file5 = await prisma.file.create({
    data: {
      filename: 'video-tutorial.mp4',
      originalName: 'How_To_Video.mp4',
      mimeType: 'video/mp4',
      size: 25600000,
      storageKey: 'uploads/2025/video.mp4',
      status: FileStatus.UPLOADING,
      userId: user2.id,
    },
  });

  console.log('✅ Created files:', {
    user1Files: [file1.filename, file2.filename, file3.filename],
    user2Files: [file4.filename, file5.filename],
  });

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });