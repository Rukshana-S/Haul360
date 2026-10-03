const dns = require('dns');
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch (_) {}
const path = require('path');
const { MongoClient, ObjectId } = require(path.resolve(__dirname, '../backend/node_modules/mongodb'));
const fs = require('fs');

// Load environment variables from backend/.env
const envPath = path.resolve(__dirname, '../backend/.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [k, ...v] = line.trim().split('=');
  if (k && v.length) env[k] = v.join('=').replace(/(^"|"$)/g, '');
});

const MONGODB_URI = env.MONGODB_URI || 'mongodb://localhost:27017/haul360';
const DB_NAME = env.DB_NAME || 'haul360';
const BASE_URL = 'http://localhost:5000/api';

const assert = (condition, msg) => {
  if (!condition) {
    console.error(`❌ Assertion Failed: ${msg}`);
    throw new Error(msg);
  }
  console.log(`   ✅ PASS: ${msg}`);
};

async function runAvailabilityVerification() {
  console.log('====================================================');
  console.log('🏁 CANONICAL MECHANIC AVAILABILITY & MONGODB SYNC VERIFICATION');
  console.log('====================================================\n');

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const mechanicsColl = db.collection('mechanics');

  console.log('1. Connecting to MongoDB and inspecting initial records...');
  const initialDocs = await mechanicsColl.find({}).toArray();
  console.log(`   Total mechanic records found: ${initialDocs.length}`);
  
  const legacyDocsBefore = await mechanicsColl.find({ availabilityStatus: { $exists: true } }).toArray();
  console.log(`   Records with legacy "availabilityStatus": ${legacyDocsBefore.length}`);

  // 2. Run Migration
  console.log('\n2. Running Migration: Standardizing all records to canonical "availability"...');
  for (const m of initialDocs) {
    const rawAvail = m.availability;
    const legacyAvail = m.availabilityStatus;
    let canonical = 'AVAILABLE';
    if (rawAvail && ['AVAILABLE', 'BUSY', 'OFFLINE'].includes(String(rawAvail).toUpperCase())) {
      canonical = String(rawAvail).toUpperCase();
    } else if (legacyAvail) {
      const leg = String(legacyAvail).toUpperCase();
      if (['AVAILABLE', 'BUSY', 'OFFLINE'].includes(leg)) {
        canonical = leg;
      }
    }
    await mechanicsColl.updateOne(
      { _id: m._id },
      {
        $set: { availability: canonical, updatedAt: new Date() },
        $unset: { availabilityStatus: '' }
      }
    );
  }
  
  const legacyDocsAfter = await mechanicsColl.find({ availabilityStatus: { $exists: true } }).toArray();
  assert(legacyDocsAfter.length === 0, 'Zero mechanic records have legacy availabilityStatus after migration');

  // 3. Register fresh mechanic for end-to-end API lifecycle test
  const uniqueSuffix = Date.now();
  const mobile = `98${Math.floor(10000000 + Math.random() * 90000000)}`.substring(0, 10);
  const email = `mech_avail_${uniqueSuffix}@haul360.in`;

  console.log(`\n3. Registering Test Mechanic (${mobile}, ${email})...`);
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      mobile,
      email,
      password: 'Password@123',
      role: 'mechanic',
      firstName: 'Harjinder',
      lastName: 'Virk',
      workshopName: 'Virk Highway Express',
      workshopAddress: 'NH-48 KM 118 Bay 2',
      specializations: ['Air Brakes', 'Heavy Electricals'],
      support247: true,
    }),
  });
  const regData = await regRes.json();
  assert(regRes.status === 201, `Mechanic registered successfully (Status ${regRes.status})`);
  
  const initLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password: 'Password@123' }),
  });
  const initLoginData = await initLoginRes.json();
  assert(initLoginRes.status === 200, 'Initial login successful');
  const token = initLoginData.data.tokens.accessToken;
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 4. Verify MongoDB Document immediately after registration
  console.log('\n4. Inspecting MongoDB document immediately after registration...');
  const userId = new ObjectId(regData.data.user.id);
  let dbMech = await mechanicsColl.findOne({ userId });
  assert(dbMech !== null, 'Mechanic record exists in MongoDB');
  assert(dbMech.availability === 'AVAILABLE', `MongoDB availability is "AVAILABLE" (found: ${dbMech.availability})`);
  assert(dbMech.availabilityStatus === undefined, `MongoDB availabilityStatus is undefined (found: ${dbMech.availabilityStatus})`);

  // 5. Test PATCH /api/mechanic/availability -> AVAILABLE
  console.log('\n5. Testing PATCH /api/mechanic/availability -> AVAILABLE...');
  let patchRes = await fetch(`${BASE_URL}/mechanic/availability`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ availability: 'AVAILABLE' }),
  });
  let patchData = await patchRes.json();
  assert(patchRes.status === 200, 'PATCH returns status 200');
  assert(patchData.data.availability === 'AVAILABLE', 'API returns availability === "AVAILABLE"');
  
  dbMech = await mechanicsColl.findOne({ userId });
  assert(dbMech.availability === 'AVAILABLE', 'MongoDB has availability: "AVAILABLE"');
  assert(dbMech.availabilityStatus === undefined, 'MongoDB has no availabilityStatus field');

  // Verify GET profile and GET summary
  const profRes1 = await fetch(`${BASE_URL}/mechanic/profile`, { headers: authHeaders });
  const profData1 = await profRes1.json();
  assert(profData1.data.availability === 'AVAILABLE', 'GET /profile returns canonical availability: "AVAILABLE"');

  const sumRes1 = await fetch(`${BASE_URL}/mechanic/summary`, { headers: authHeaders });
  const sumData1 = await sumRes1.json();
  assert(sumData1.data.availability === 'AVAILABLE', 'GET /summary returns canonical availability: "AVAILABLE"');

  // 6. Test PATCH /api/mechanic/availability -> BUSY
  console.log('\n6. Testing PATCH /api/mechanic/availability -> BUSY...');
  patchRes = await fetch(`${BASE_URL}/mechanic/availability`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ availability: 'BUSY' }),
  });
  patchData = await patchRes.json();
  assert(patchRes.status === 200, 'PATCH returns status 200');
  assert(patchData.data.availability === 'BUSY', 'API returns availability === "BUSY"');
  
  dbMech = await mechanicsColl.findOne({ userId });
  assert(dbMech.availability === 'BUSY', 'MongoDB has availability: "BUSY"');
  assert(dbMech.availabilityStatus === undefined, 'MongoDB has no availabilityStatus field');

  const profRes2 = await fetch(`${BASE_URL}/mechanic/profile`, { headers: authHeaders });
  const profData2 = await profRes2.json();
  assert(profData2.data.availability === 'BUSY', 'GET /profile returns canonical availability: "BUSY"');

  // 7. Test PATCH /api/mechanic/availability -> OFFLINE
  console.log('\n7. Testing PATCH /api/mechanic/availability -> OFFLINE...');
  patchRes = await fetch(`${BASE_URL}/mechanic/availability`, {
    method: 'PATCH',
    headers: authHeaders,
    body: JSON.stringify({ availability: 'OFFLINE' }),
  });
  patchData = await patchRes.json();
  assert(patchRes.status === 200, 'PATCH returns status 200');
  assert(patchData.data.availability === 'OFFLINE', 'API returns availability === "OFFLINE"');
  
  dbMech = await mechanicsColl.findOne({ userId });
  assert(dbMech.availability === 'OFFLINE', 'MongoDB has availability: "OFFLINE"');
  assert(dbMech.availabilityStatus === undefined, 'MongoDB has no availabilityStatus field');

  // 8. Test Persistence across Re-login
  console.log('\n8. Testing Persistence across Re-login (verifying OFFLINE persists)...');
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, password: 'Password@123' }),
  });
  const loginData = await loginRes.json();
  const reToken = loginData.data.tokens.accessToken;
  const reHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${reToken}` };

  const profRes3 = await fetch(`${BASE_URL}/mechanic/profile`, { headers: reHeaders });
  const profData3 = await profRes3.json();
  assert(profData3.data.availability === 'OFFLINE', 'Profile after re-login accurately preserves "OFFLINE"');

  // 9. Reset to AVAILABLE then test Service Request Acceptance (auto BUSY transition)
  console.log('\n9. Resetting to AVAILABLE and testing Service Request Acceptance...');
  await fetch(`${BASE_URL}/mechanic/availability`, {
    method: 'PATCH',
    headers: reHeaders,
    body: JSON.stringify({ availability: 'AVAILABLE' }),
  });

  const reqListRes = await fetch(`${BASE_URL}/mechanic/requests`, { headers: reHeaders });
  const reqListData = await reqListRes.json();
  assert(reqListData.data.length > 0, `Pending requests available for acceptance (found ${reqListData.data.length})`);
  const targetReqId = reqListData.data[0].id || reqListData.data[0].requestId;

  const acceptRes = await fetch(`${BASE_URL}/mechanic/requests/${targetReqId}/accept`, {
    method: 'POST',
    headers: reHeaders,
  });
  const acceptData = await acceptRes.json();
  assert(acceptRes.status === 200, 'Request accepted successfully');
  const repairId = acceptData.data.repair.id || acceptData.data.repair.repairId;

  dbMech = await mechanicsColl.findOne({ userId });
  assert(dbMech.availability === 'BUSY', 'Accepting service request automatically switched MongoDB availability to "BUSY"');
  assert(dbMech.availabilityStatus === undefined, 'No availabilityStatus field recreated');

  // 10. Advance Repair through lifecycle to completion (auto AVAILABLE transition)
  console.log('\n10. Advancing Repair to completion and testing auto-restore to AVAILABLE...');
  await fetch(`${BASE_URL}/mechanic/repairs/${repairId}/arrive`, { method: 'POST', headers: reHeaders });
  await fetch(`${BASE_URL}/mechanic/repairs/${repairId}/start`, { method: 'POST', headers: reHeaders });
  await fetch(`${BASE_URL}/mechanic/repairs/${repairId}/ready`, { method: 'POST', headers: reHeaders });
  
  const completeRes = await fetch(`${BASE_URL}/mechanic/repairs/${repairId}/complete`, {
    method: 'POST',
    headers: reHeaders,
  });
  assert(completeRes.status === 200, 'Repair successfully completed and settled');

  dbMech = await mechanicsColl.findOne({ userId });
  assert(dbMech.availability === 'AVAILABLE', 'Completing repair automatically restored MongoDB availability to "AVAILABLE"');
  assert(dbMech.availabilityStatus === undefined, 'No availabilityStatus field recreated');

  // 11. Verify Database-wide Integrity
  console.log('\n11. Final Database-wide Schema Audit...');
  const remainingLegacy = await mechanicsColl.find({ availabilityStatus: { $exists: true } }).toArray();
  assert(remainingLegacy.length === 0, `Database-wide audit: exactly 0 mechanics have legacy availabilityStatus`);

  console.log('\n====================================================');
  console.log('✅ ALL CANONICAL AVAILABILITY & MONGODB VERIFICATION TESTS PASSED!');
  console.log('====================================================');

  await client.close();
}

runAvailabilityVerification().catch((err) => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
