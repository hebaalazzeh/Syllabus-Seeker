const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log('Starting database cleanup...');

    // Clear tables in the correct order to respect foreign key constraints
    const deletions = [
      // First, delete all ratings as they depend on other tables
      prisma.rating.deleteMany().then(() => console.log('Cleared ratings')),
      
      // Then delete syllabi
      prisma.syllabus.deleteMany().then(() => console.log('Cleared syllabi')),
      
      // Then professors
      prisma.professor.deleteMany().then(() => console.log('Cleared professors')),
      
      // Then courses
      prisma.course.deleteMany().then(() => console.log('Cleared courses')),
      
      // Then schools
      prisma.school.deleteMany().then(() => console.log('Cleared schools')),
      
      // Finally users if they exist
      prisma.user.deleteMany().then(() => console.log('Cleared users'))
    ];

    await Promise.all(deletions);

    // Verify tables are empty
    console.log('\nVerifying tables are empty...');
    
    const counts = await Promise.all([
      prisma.rating.count(),
      prisma.syllabus.count(),
      prisma.professor.count(),
      prisma.course.count(),
      prisma.school.count(),
      prisma.user.count()
    ]);

    const tableNames = ['Rating', 'Syllabus', 'Professor', 'Course', 'School', 'User'];
    
    counts.forEach((count, index) => {
      console.log(`${tableNames[index]}: ${count} records`);
    });

    console.log('\nDatabase cleanup completed successfully!');

  } catch (error) {
    console.error('Error during database cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clearDatabase()
  .then(() => {
    console.log('Successfully completed database cleanup');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to clear database:', error);
    process.exit(1);
  });