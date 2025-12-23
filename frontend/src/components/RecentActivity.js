// components/admin/RecentActivity.jsx
export default function RecentActivity() {
    const activities = [
      {
        id: 1,
        user: 'Sarah Johnson',
        action: 'placed a new order',
        time: 'Just now',
        avatar: 'SJ',
        color: '#4361ee'
      },
      {
        id: 2,
        user: 'Mike Chen',
        action: 'updated profile',
        time: '5 minutes ago',
        avatar: 'MC',
        color: '#4cc9f0'
      },
      {
        id: 3,
        user: 'Admin',
        action: 'added new product',
        time: '30 minutes ago',
        avatar: 'AD',
        color: '#f72585'
      },
      {
        id: 4,
        user: 'Emma Wilson',
        action: 'completed payment',
        time: '2 hours ago',
        avatar: 'EW',
        color: '#7209b7'
      },
      {
        id: 5,
        user: 'System',
        action: 'scheduled maintenance',
        time: '5 hours ago',
        avatar: 'SY',
        color: '#3a0ca3'
      }
    ];
  
    return (
      <div className="recent-activity">
        <div className="activity-header">
          <h3>Recent Activity</h3>
          <a href="#" className="view-all">View All</a>
        </div>
        <div className="activity-list">
          {activities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div 
                className="activity-avatar" 
                style={{ backgroundColor: activity.color }}
              >
                {activity.avatar}
              </div>
              <div className="activity-content">
                <p>
                  <strong>{activity.user}</strong> {activity.action}
                </p>
                <small>{activity.time}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }