import { Router } from 'express';
import { authenticate, requireRole } from '../middleware/authMiddleware';
import * as mechanicController from '../controllers/mechanicController';

const router = Router();

// Protect all mechanic endpoints with JWT authentication and mechanic role guard
router.use(authenticate, requireRole('mechanic'));

// 1. Mechanic Profile & Settings
router.get('/profile', (req, res, next) => mechanicController.getProfile(req, res, next));
router.put('/profile', (req, res, next) => mechanicController.updateProfile(req, res, next));

// 2. Dispatch Availability & SOS Preference
router.patch('/availability', (req, res, next) => mechanicController.updateAvailability(req, res, next));
router.patch('/sos', (req, res, next) => mechanicController.updateSos(req, res, next));

// 3. Metric Summary
router.get('/summary', (req, res, next) => mechanicController.getSummary(req, res, next));

// 4. Service Requests & Dispatch
router.get('/requests', (req, res, next) => mechanicController.getRequests(req, res, next));
router.get('/requests/:id', (req, res, next) => mechanicController.getRequestById(req, res, next));
router.post('/requests/:id/accept', (req, res, next) => mechanicController.acceptRequest(req, res, next));
router.post('/requests/:id/reject', (req, res, next) => mechanicController.rejectRequest(req, res, next));

// 5. Repair Lifecycle
router.get('/repairs', (req, res, next) => mechanicController.getRepairs(req, res, next));
router.get('/repairs/:id', (req, res, next) => mechanicController.getRepairById(req, res, next));
router.post('/repairs/:id/arrive', (req, res, next) => mechanicController.arriveRepair(req, res, next));
router.post('/repairs/:id/diagnose', (req, res, next) => mechanicController.diagnoseRepair(req, res, next));
router.post('/repairs/:id/start', (req, res, next) => mechanicController.startRepair(req, res, next));
router.post('/repairs/:id/ready', (req, res, next) => mechanicController.readyRepair(req, res, next));
router.post('/repairs/:id/complete', (req, res, next) => mechanicController.completeRepair(req, res, next));

// 6. Service History
router.get('/service-history', (req, res, next) => mechanicController.getServiceHistory(req, res, next));

// 7. Earnings & Settlements
router.get('/earnings', (req, res, next) => mechanicController.getEarnings(req, res, next));
router.get('/earnings/summary', (req, res, next) => mechanicController.getEarningsSummary(req, res, next));

// 8. Reviews
router.get('/reviews', (req, res, next) => mechanicController.getReviews(req, res, next));
router.get('/reviews/summary', (req, res, next) => mechanicController.getReviewsSummary(req, res, next));

// 9. Documents
router.get('/documents', (req, res, next) => mechanicController.getDocuments(req, res, next));
router.get('/documents/:id', (req, res, next) => mechanicController.getDocumentById(req, res, next));

// 10. SOS Events
router.post('/sos/trigger', (req, res, next) => mechanicController.triggerSos(req, res, next));
router.post('/sos/:id/resolve', (req, res, next) => mechanicController.resolveSos(req, res, next));

export default router;
