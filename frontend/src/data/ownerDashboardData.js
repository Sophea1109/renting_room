export const ownerRooms = [
  { id: 'R-101', status: 'occupied' },
  { id: 'R-102', status: 'occupied' },
  { id: 'R-103', status: 'available' },
  { id: 'R-104', status: 'occupied' },
  { id: 'R-105', status: 'available' },
  { id: 'R-106', status: 'occupied' },
  { id: 'R-107', status: 'occupied' },
  { id: 'R-108', status: 'available' },
  { id: 'R-109', status: 'occupied' },
  { id: 'R-110', status: 'occupied' },
  { id: 'R-111', status: 'available' },
  { id: 'R-112', status: 'occupied' },
];

// Start here for real data:
// - Replace this list with records from your booking/payment tables.
// - Keep `amount`, `paidAt`, and `status` fields so KPI helpers can run unchanged.
export const ownerPayments = [
  { id: 'P-001', amount: 650, paidAt: '2026-01-05', status: 'paid' },
  { id: 'P-002', amount: 700, paidAt: '2026-01-18', status: 'paid' },
  { id: 'P-003', amount: 800, paidAt: '2026-02-02', status: 'paid' },
  { id: 'P-004', amount: 820, paidAt: '2026-02-16', status: 'paid' },
  { id: 'P-005', amount: 860, paidAt: '2026-03-03', status: 'paid' },
  { id: 'P-006', amount: 900, paidAt: '2026-03-14', status: 'paid' },
  { id: 'P-007', amount: 920, paidAt: '2026-04-01', status: 'paid' },
  { id: 'P-008', amount: 940, paidAt: '2026-04-20', status: 'paid' },
  { id: 'P-009', amount: 960, paidAt: '2026-05-07', status: 'paid' },
  { id: 'P-010', amount: 980, paidAt: '2026-05-22', status: 'paid' },
  { id: 'P-011', amount: 1000, paidAt: '2026-06-10', status: 'paid' },
  { id: 'P-012', amount: 1020, paidAt: '2026-07-03', status: 'paid' },
];

// Snapshot trend (oldest -> newest) to visualize occupancy changes.
export const weeklyOccupancySnapshots = [
  { day: 'Mon', occupied: 7, available: 5 },
  { day: 'Tue', occupied: 8, available: 4 },
  { day: 'Wed', occupied: 8, available: 4 },
  { day: 'Thu', occupied: 7, available: 5 },
  { day: 'Fri', occupied: 9, available: 3 },
  { day: 'Sat', occupied: 8, available: 4 },
  { day: 'Sun', occupied: 8, available: 4 },
];