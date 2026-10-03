import {
  getUsersCollection,
  getDriversCollection,
  getMechanicsCollection,
  getOrganizationsCollection,
  getTransportOfficesCollection,
  getVehiclesCollection,
  getDocumentsCollection,
  getServiceRequestsCollection,
  getRepairsCollection,
  getEarningsCollection,
  getReviewsCollection,
  getSosEventsCollection,
} from '../models';

/**
 * Initialize all required MongoDB indexes for Haul360.
 * Ensures data integrity, uniqueness constraints, and high-performance querying.
 */
export const initializeDatabaseIndexes = async (): Promise<void> => {
  try {
    console.log('🔄 Initializing database indexes...');

    // 1. Users Collection Indexes
    const usersCollection = getUsersCollection();
    await usersCollection.createIndexes([
      { key: { mobile: 1 }, unique: true, name: 'idx_users_mobile_unique' },
      { key: { email: 1 }, unique: true, sparse: true, name: 'idx_users_email_unique' },
      { key: { role: 1 }, name: 'idx_users_role' },
    ]);

    // 2. Drivers Collection Indexes
    const driversCollection = getDriversCollection();
    await driversCollection.createIndexes([
      { key: { userId: 1 }, unique: true, name: 'idx_drivers_userId_unique' },
      { key: { availabilityStatus: 1 }, name: 'idx_drivers_availabilityStatus' },
      { key: { 'address.city': 1 }, name: 'idx_drivers_city' },
    ]);

    // 3. Mechanics Collection Indexes
    const mechanicsCollection = getMechanicsCollection();
    await mechanicsCollection.createIndexes([
      { key: { userId: 1 }, unique: true, name: 'idx_mechanics_userId_unique' },
      { key: { availability: 1 }, name: 'idx_mechanics_availability' },
      { key: { 'workshopDetails.city': 1 }, name: 'idx_mechanics_city' },
      { key: { 'serviceDetails.vehicleTypes': 1 }, name: 'idx_mechanics_vehicleTypes' },
    ]);

    // 4. Organizations Collection Indexes
    const organizationsCollection = getOrganizationsCollection();
    await organizationsCollection.createIndexes([
      { key: { userId: 1 }, unique: true, name: 'idx_organizations_userId_unique' },
      { key: { gstNumber: 1 }, unique: true, sparse: true, name: 'idx_organizations_gst_unique' },
      { key: { 'businessAddress.city': 1 }, name: 'idx_organizations_city' },
    ]);

    // 5. Transport Offices Collection Indexes
    const transportOfficesCollection = getTransportOfficesCollection();
    await transportOfficesCollection.createIndexes([
      { key: { userId: 1 }, unique: true, name: 'idx_transportOffices_userId_unique' },
      { key: { 'address.city': 1 }, name: 'idx_transportOffices_city' },
    ]);

    // 6. Vehicles Collection Indexes
    const vehiclesCollection = getVehiclesCollection();
    await vehiclesCollection.createIndexes([
      { key: { driverId: 1 }, name: 'idx_vehicles_driverId' },
      { key: { vehicleNumber: 1 }, unique: true, name: 'idx_vehicles_vehicleNumber_unique' },
      { key: { status: 1 }, name: 'idx_vehicles_status' },
    ]);

    // 7. Documents Collection Indexes
    const documentsCollection = getDocumentsCollection();
    await documentsCollection.createIndexes([
      { key: { userId: 1 }, name: 'idx_documents_userId' },
      { key: { documentType: 1 }, name: 'idx_documents_documentType' },
      { key: { verificationStatus: 1 }, name: 'idx_documents_verificationStatus' },
      { key: { userId: 1, documentType: 1 }, name: 'idx_documents_userId_documentType' },
    ]);

    // 8. Service Requests Collection Indexes
    const serviceRequestsCollection = getServiceRequestsCollection();
    await serviceRequestsCollection.createIndexes([
      { key: { requestId: 1 }, unique: true, name: 'idx_serviceRequests_requestId_unique' },
      { key: { status: 1 }, name: 'idx_serviceRequests_status' },
      { key: { assignedMechanicId: 1 }, name: 'idx_serviceRequests_assignedMechanicId' },
      { key: { isEmergency: -1, urgency: 1, createdAt: -1 }, name: 'idx_serviceRequests_priority' },
    ]);

    // 9. Repairs Collection Indexes
    const repairsCollection = getRepairsCollection();
    await repairsCollection.createIndexes([
      { key: { repairId: 1 }, unique: true, name: 'idx_repairs_repairId_unique' },
      { key: { mechanicId: 1 }, name: 'idx_repairs_mechanicId' },
      { key: { status: 1 }, name: 'idx_repairs_status' },
      { key: { requestId: 1 }, name: 'idx_repairs_requestId' },
    ]);

    // 10. Earnings Collection Indexes
    const earningsCollection = getEarningsCollection();
    await earningsCollection.createIndexes([
      { key: { transactionId: 1 }, unique: true, name: 'idx_earnings_transactionId_unique' },
      { key: { mechanicId: 1 }, name: 'idx_earnings_mechanicId' },
      { key: { repairId: 1 }, name: 'idx_earnings_repairId' },
      { key: { status: 1 }, name: 'idx_earnings_status' },
      { key: { createdAt: -1 }, name: 'idx_earnings_createdAt' },
    ]);

    // 11. Reviews Collection Indexes
    const reviewsCollection = getReviewsCollection();
    await reviewsCollection.createIndexes([
      { key: { reviewId: 1 }, unique: true, name: 'idx_reviews_reviewId_unique' },
      { key: { mechanicId: 1 }, name: 'idx_reviews_mechanicId' },
      { key: { rating: 1 }, name: 'idx_reviews_rating' },
    ]);

    // 12. SOS Events Collection Indexes
    const sosEventsCollection = getSosEventsCollection();
    await sosEventsCollection.createIndexes([
      { key: { sosId: 1 }, unique: true, name: 'idx_sosEvents_sosId_unique' },
      { key: { mechanicId: 1 }, name: 'idx_sosEvents_mechanicId' },
      { key: { status: 1 }, name: 'idx_sosEvents_status' },
    ]);

    console.log('✅ Database indexes initialized successfully.');
  } catch (error) {
    console.error('❌ Failed to initialize database indexes:', error);
    throw error;
  }
};
