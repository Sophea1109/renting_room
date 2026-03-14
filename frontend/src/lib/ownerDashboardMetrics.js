function getMonthLabel(dateValue) {
  const date = new Date(dateValue);
  return date.toLocaleString('en-US', { month: 'short' });
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateDashboardMetrics(rooms = [], payments = []) {
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter((room) => room.status === 'occupied').length;
  const availableRooms = rooms.filter((room) => room.status === 'available').length;

  const paidPayments = payments.filter((payment) => payment.status === 'paid');
  const totalRevenue = paidPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const occupancyRate = totalRooms === 0 ? 0 : (occupiedRooms / totalRooms) * 100;

  return {
    totalRooms,
    occupiedRooms,
    availableRooms,
    totalRevenue,
    occupancyRate,
  };
}

export function buildMonthlyRevenueSeries(payments = []) {
  const paidPayments = payments.filter((payment) => payment.status === 'paid');
  const grouped = paidPayments.reduce((acc, payment) => {
    const month = getMonthLabel(payment.paidAt);
    acc[month] = (acc[month] || 0) + Number(payment.amount || 0);
    return acc;
  }, {});

  return Object.entries(grouped).map(([month, revenue]) => ({ month, revenue }));
}