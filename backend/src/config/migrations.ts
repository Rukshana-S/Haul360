import { getMechanicsCollection } from '../models';

/**
 * Run safe startup migrations on MongoDB database.
 * Ensures legacy schema differences (e.g. availabilityStatus) are canonically migrated to `availability`.
 */
export const runDatabaseMigrations = async (): Promise<void> => {
  try {
    const mechanicsColl = getMechanicsCollection();

    // 1. Drop legacy index 'idx_mechanics_availabilityStatus' if it exists
    try {
      const existingIndexes = await mechanicsColl.indexes();
      const hasOldIndex = existingIndexes.some((idx) => idx.name === 'idx_mechanics_availabilityStatus');
      if (hasOldIndex) {
        await mechanicsColl.dropIndex('idx_mechanics_availabilityStatus');
        console.log('🧹 Dropped legacy index: idx_mechanics_availabilityStatus');
      }
    } catch (idxErr: any) {
      // Non-fatal if index did not exist
      if (idxErr?.code !== 27 && idxErr?.codeName !== 'IndexNotFound') {
        console.warn('⚠️ Note on index check:', idxErr?.message || idxErr);
      }
    }

    // 2. Query any mechanic documents that have legacy availabilityStatus or missing availability
    const cursor = mechanicsColl.find({
      $or: [
        { availabilityStatus: { $exists: true } } as any,
        { availability: { $exists: false } } as any,
      ],
    });

    const mechanicsToMigrate = await cursor.toArray();
    if (mechanicsToMigrate.length > 0) {
      console.log(`🔄 Migrating ${mechanicsToMigrate.length} mechanic document(s) to canonical availability...`);
      for (const m of mechanicsToMigrate) {
        const rawAvail = (m as any).availability;
        const legacyAvail = (m as any).availabilityStatus;

        let canonical: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
        if (rawAvail && ['AVAILABLE', 'BUSY', 'OFFLINE'].includes(String(rawAvail).toUpperCase())) {
          canonical = String(rawAvail).toUpperCase() as 'AVAILABLE' | 'BUSY' | 'OFFLINE';
        } else if (legacyAvail) {
          const leg = String(legacyAvail).toUpperCase();
          if (leg === 'AVAILABLE' || leg === 'BUSY' || leg === 'OFFLINE') {
            canonical = leg as 'AVAILABLE' | 'BUSY' | 'OFFLINE';
          } else {
            canonical = 'AVAILABLE';
          }
        } else {
          canonical = 'AVAILABLE';
        }

        await mechanicsColl.updateOne(
          { _id: m._id },
          {
            $set: { availability: canonical, updatedAt: new Date() },
            $unset: { availabilityStatus: '' } as any,
          }
        );
      }
      console.log('✅ Mechanic availability migration completed successfully.');
    }
  } catch (error) {
    console.error('❌ Failed to run database migrations:', error);
  }
};
