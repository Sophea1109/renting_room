// components/admin/DashboardStats.jsx
export default function DashboardStats() {
    const stats = [
      {
        id: 1,
        title: 'Total Users',
        value: '2,847',
        change: '+12.5%',
        trend: 'up',
        icon: 'fas fa-users',
        color: '#4361ee'
      },
      {
        id: 2,
        title: 'Revenue',
        value: '$24,580',
        change: '+8.2%',
        trend: 'up',
        icon: 'fas fa-dollar-sign',
        color: '#4cc9f0'
      },
      {
        id: 3,
        title: 'Orders',
        value: '1,254',
        change: '-3.1%',
        trend: 'down',
        icon: 'fas fa-shopping-cart',
        color: '#f72585'
      },
      {
        id: 4,
        title: 'Conversion Rate',
        value: '3.25%',
        change: '+2.4%',
        trend: 'up',
        icon: 'fas fa-chart-line',
        color: '#7209b7'
      }
    ];
  
    return (
      <div className="dashboard-stats">
        {stats.map(stat => (
          <div key={stat.id} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                <i className={stat.icon} style={{ color: stat.color }}></i>
              </div>
              <div className={`stat-change ${stat.trend}`}>
                <i className={`fas fa-arrow-${stat.trend}`}></i>
                {stat.change}
              </div>
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            <div className="stat-progress">
              <div 
                className="progress-bar" 
                style={{ 
                  width: stat.trend === 'up' ? '75%' : '45%',
                  backgroundColor: stat.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }