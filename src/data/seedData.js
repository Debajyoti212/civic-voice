import { generateId } from '../utils/helpers.js';
import { db } from '../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const LOCATIONS = [
  { lat: 28.6139, lng: 77.2090, area: 'Connaught Place, Delhi' },
  { lat: 28.6304, lng: 77.2177, area: 'Karol Bagh, Delhi' },
  { lat: 28.5355, lng: 77.2410, area: 'Saket, Delhi' },
  { lat: 28.6692, lng: 77.4538, area: 'Noida Sector 18' },
  { lat: 28.4595, lng: 77.0266, area: 'Gurugram, Haryana' },
  { lat: 28.6508, lng: 77.2317, area: 'Paharganj, Delhi' },
  { lat: 28.5672, lng: 77.2100, area: 'Hauz Khas, Delhi' },
  { lat: 28.7041, lng: 77.1025, area: 'Rohini, Delhi' },
  { lat: 28.6129, lng: 77.2295, area: 'India Gate, Delhi' },
  { lat: 28.5921, lng: 77.2467, area: 'Lajpat Nagar, Delhi' },
  { lat: 28.6353, lng: 77.2250, area: 'Rajiv Chowk, Delhi' },
  { lat: 28.5494, lng: 77.2001, area: 'Malviya Nagar, Delhi' },
];

const ISSUE_TEMPLATES = [
  { category: 'roads', title: 'Large pothole on main road', description: 'A dangerous pothole has formed on the main road near the market area. Multiple accidents have been reported. Immediate repair needed.', priority: 'high' },
  { category: 'roads', title: 'Broken speed breaker', description: 'The speed breaker near the school has broken apart, creating a hazard for vehicles and pedestrians.', priority: 'medium' },
  { category: 'water', title: 'Water pipe leakage', description: 'A major water pipe is leaking near the residential colony. Significant water wastage observed for the past 3 days.', priority: 'high' },
  { category: 'water', title: 'No water supply since morning', description: 'Our entire block has had no water supply since 6 AM today. This is a recurring issue that needs permanent resolution.', priority: 'critical' },
  { category: 'electricity', title: 'Street lights not working', description: 'Multiple street lights on the main avenue have been non-functional for over a week. The area is very dark at night.', priority: 'medium' },
  { category: 'electricity', title: 'Exposed electrical wires', description: 'Dangerous exposed wires hanging low near the park entrance. Immediate attention required for public safety.', priority: 'critical' },
  { category: 'sanitation', title: 'Garbage not collected for 5 days', description: 'The garbage collection truck has not visited our area for 5 days. Waste is piling up and causing hygiene concerns.', priority: 'high' },
  { category: 'sanitation', title: 'Overflowing dustbin near market', description: 'The community dustbin near the vegetable market is overflowing. Needs immediate cleaning and possibly a larger bin.', priority: 'medium' },
  { category: 'safety', title: 'Broken traffic signal at intersection', description: 'The traffic signal at the main intersection has been malfunctioning since yesterday. Causing traffic jams and near-misses.', priority: 'critical' },
  { category: 'drainage', title: 'Blocked drainage causing flooding', description: 'The drainage system near sector 5 is completely blocked, causing waterlogging during rains. Roads become impassable.', priority: 'high' },
  { category: 'parks', title: 'Broken playground equipment', description: 'Several swings and slides in the community park are broken and rusty. Children could get injured.', priority: 'medium' },
  { category: 'other', title: 'Illegal parking blocking footpath', description: 'Vehicles are regularly parked on the footpath near the metro station, forcing pedestrians to walk on the road.', priority: 'low' },
];

function randomDate(daysBack) {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  d.setHours(Math.floor(Math.random() * 14) + 7);
  d.setMinutes(Math.floor(Math.random() * 60));
  return d.toISOString();
}

const STATUSES = ['pending', 'acknowledged', 'in_progress', 'resolved'];

export function generateMockIssues(count = 25) {
  const issues = [];
  for (let i = 0; i < count; i++) {
    const template = ISSUE_TEMPLATES[i % ISSUE_TEMPLATES.length];
    const loc = LOCATIONS[i % LOCATIONS.length];
    const statusIdx = Math.floor(Math.random() * STATUSES.length);
    const createdAt = randomDate(30);
    const updates = [];

    if (statusIdx >= 1) {
      updates.push({ status: 'acknowledged', note: 'Issue received and assigned to the department.', timestamp: randomDate(20), by: 'System' });
    }
    if (statusIdx >= 2) {
      updates.push({ status: 'in_progress', note: 'Work crew dispatched to the location.', timestamp: randomDate(10), by: 'Municipal Staff' });
    }
    if (statusIdx >= 3) {
      updates.push({ status: 'resolved', note: 'Issue has been fixed. Please verify.', timestamp: randomDate(3), by: 'Municipal Staff' });
    }

    issues.push({
      title: template.title + (i >= ISSUE_TEMPLATES.length ? ` (#${i + 1})` : ''),
      description: template.description,
      category: template.category,
      priority: template.priority,
      status: STATUSES[statusIdx],
      location: loc,
      photo: null,
      reportedBy: i < 5 ? 'unknown_user' : `user_${Math.floor(Math.random() * 100)}`,
      createdAt,
      updatedAt: updates.length > 0 ? updates[updates.length - 1].timestamp : createdAt,
      updates,
      rating: STATUSES[statusIdx] === 'resolved' ? Math.floor(Math.random() * 3) + 3 : null,
      department: ['Public Works', 'Water Board', 'Electricity Board', 'Sanitation Dept', 'Police', 'Municipal Corp'][Math.floor(Math.random() * 6)],
    });
  }
  return issues;
}

export async function seedData() {
  try {
    const querySnapshot = await getDocs(collection(db, 'issues'));
    if (querySnapshot.empty) {
      console.log('Seeding mock data to Firestore...');
      const issues = generateMockIssues(25);
      for (const issue of issues) {
        await addDoc(collection(db, 'issues'), issue);
      }
      console.log('Seeding complete.');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
