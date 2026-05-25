# CyberMilo API Reference Guide

Complete reference for all available APIs and functions in the CyberMilo system.

---

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Database Operations](#database-operations)
3. [AI Functions](#ai-functions)
4. [React Hooks](#react-hooks)
5. [Context APIs](#context-apis)
6. [Helper Functions](#helper-functions)

---

## Authentication API

### Location: `src/lib/supabase.js`

#### `signUpUser(email, password, userData)`
Register a new user account.

```javascript
const { data, error } = await signUpUser(
  'user@example.com',
  'SecurePass123',
  {
    first_name: 'John',
    last_name: 'Doe',
    role: 'student'
  }
);
```

**Parameters:**
- `email` (string) - User email address
- `password` (string) - User password (min 8 chars)
- `userData` (object) - Additional user metadata

**Returns:**
- `data` - User object with ID and session
- `error` - Error object if signup fails

---

#### `signInUser(email, password)`
Log in an existing user.

```javascript
const { data, error } = await signInUser(
  'user@example.com',
  'SecurePass123'
);
```

**Parameters:**
- `email` (string) - User email
- `password` (string) - User password

**Returns:**
- `data` - Session and user info
- `error` - Error object if login fails

---

#### `signOutUser()`
Log out the current user.

```javascript
const { error } = await signOutUser();
```

**Returns:**
- `error` - Error object if logout fails

---

#### `getCurrentUser()`
Get the currently authenticated user.

```javascript
const user = await getCurrentUser();
console.log(user.id, user.email);
```

**Returns:**
- `user` - Current user object or null

---

#### `getSession()`
Get the current session.

```javascript
const session = await getSession();
console.log(session.access_token);
```

**Returns:**
- `session` - Session object or null

---

## Database Operations

### Location: `src/lib/supabase.js`

All database functions use the Supabase client and follow RLS policies.

#### `insertRecord(table, record)`
Insert a new record into a table.

```javascript
const { data, error } = await insertRecord('students', {
  admission_number: 'ADM001',
  first_name: 'Rahul',
  last_name: 'Kumar',
  email: 'rahul@school.com',
  class_id: 'uuid-here',
  status: 'active'
});
```

**Parameters:**
- `table` (string) - Table name
- `record` (object) - Record data

**Returns:**
- `data` - Inserted record
- `error` - Error object if fails

---

#### `updateRecord(table, id, updates)`
Update an existing record.

```javascript
const { data, error } = await updateRecord(
  'students',
  'uuid-here',
  { status: 'inactive' }
);
```

**Parameters:**
- `table` (string) - Table name
- `id` (string) - Record ID (UUID)
- `updates` (object) - Fields to update

**Returns:**
- `data` - Updated record
- `error` - Error object if fails

---

#### `deleteRecord(table, id)`
Delete a record.

```javascript
const { error } = await deleteRecord('students', 'uuid-here');
```

**Parameters:**
- `table` (string) - Table name
- `id` (string) - Record ID

**Returns:**
- `error` - Error object if fails

---

#### `getRecords(table, filters)`
Fetch multiple records with filters.

```javascript
const { data, error } = await getRecords('students', {
  class_id: 'uuid-here',
  status: 'active'
});
```

**Parameters:**
- `table` (string) - Table name
- `filters` (object) - Filter conditions

**Returns:**
- `data` - Array of records
- `error` - Error object if fails

---

#### `getRecord(table, id)`
Fetch a single record by ID.

```javascript
const { data, error } = await getRecord('students', 'uuid-here');
```

**Parameters:**
- `table` (string) - Table name
- `id` (string) - Record ID

**Returns:**
- `data` - Single record object
- `error` - Error object if fails

---

#### `subscribeToTable(table, callback)`
Subscribe to real-time changes.

```javascript
const subscription = subscribeToTable('students', (data) => {
  console.log('Student updated:', data);
});

// Unsubscribe when needed
subscription.unsubscribe();
```

**Parameters:**
- `table` (string) - Table to watch
- `callback` (function) - Function to call on changes

**Returns:**
- `subscription` - Subscription object with unsubscribe method

---

#### `uploadFile(bucket, path, file)`
Upload a file to storage.

```javascript
const { data, error } = await uploadFile(
  'documents',
  'admissions/proof.pdf',
  fileObject
);
```

**Parameters:**
- `bucket` (string) - Storage bucket name
- `path` (string) - File path in bucket
- `file` (File) - File object from input

**Returns:**
- `data` - Upload result
- `error` - Error object if fails

---

#### `deleteFile(bucket, path)`
Delete a file from storage.

```javascript
const { error } = await deleteFile('documents', 'admissions/proof.pdf');
```

**Parameters:**
- `bucket` (string) - Storage bucket
- `path` (string) - File path

**Returns:**
- `error` - Error object if fails

---

#### `getPublicUrl(bucket, path)`
Get public URL for a file.

```javascript
const url = getPublicUrl('documents', 'admissions/proof.pdf');
console.log(url);
```

**Parameters:**
- `bucket` (string) - Storage bucket
- `path` (string) - File path

**Returns:**
- `url` (string) - Public URL

---

## AI Functions

### Location: `src/lib/openrouter.js`

All AI functions use OpenRouter API and return structured responses.

#### `callAI(prompt, model, options)`
Generic AI call function.

```javascript
const response = await callAI(
  'Explain photosynthesis',
  'gpt-4',
  { temperature: 0.7, max_tokens: 500 }
);
```

**Parameters:**
- `prompt` (string) - Input prompt
- `model` (string) - Model name (gpt-4, claude-3, gemini-pro)
- `options` (object) - Optional parameters

**Returns:**
- `response` (string) - AI response

---

#### `admissionChatbot(question)`
AI admission counselor.

```javascript
const answer = await admissionChatbot(
  'What are the admission criteria?'
);
```

**Parameters:**
- `question` (string) - Student question

**Returns:**
- `answer` (string) - AI response

---

#### `generateLessonPlan(subject, class, topic, duration)`
Generate lesson plan.

```javascript
const plan = await generateLessonPlan(
  'Mathematics',
  '10th',
  'Trigonometry',
  '45 minutes'
);
```

**Returns:**
- `plan` (string) - Structured lesson plan

---

#### `generateQuestionPaper(subject, class, difficulty, count)`
Generate question paper.

```javascript
const paper = await generateQuestionPaper(
  'English',
  '10th',
  'medium',
  50
);
```

**Returns:**
- `paper` (string) - Question paper content

---

#### `analyzeStudentRisk(studentData)`
Identify at-risk students.

```javascript
const analysis = await analyzeStudentRisk({
  attendance: 65,
  avgMarks: 42,
  behaviorIssues: 2,
  familyBackground: 'low-income'
});
```

**Returns:**
- `analysis` (object) - Risk assessment with recommendations

---

#### `feeRecoveryAssistant(studentData)`
Generate fee recovery strategies.

```javascript
const strategy = await feeRecoveryAssistant({
  studentName: 'Rahul Kumar',
  pending: 15000,
  daysOverdue: 30,
  lastPayment: '2024-05-15'
});
```

**Returns:**
- `strategy` (object) - Recovery strategies with effectiveness scores

---

#### `generateTimetable(classData)`
Generate optimized timetable.

```javascript
const timetable = await generateTimetable({
  classes: ['10A', '10B', '10C'],
  subjects: ['Math', 'English', 'Science', 'History'],
  teachers: 8,
  periods: 6
});
```

**Returns:**
- `timetable` (array) - Optimized schedule

---

#### `recommendCareerPath(studentData)`
Career path recommendations.

```javascript
const careers = await recommendCareerPath({
  mathematics: 85,
  science: 90,
  english: 78,
  interests: ['technology', 'innovation'],
  aptitude: 'analytical'
});
```

**Returns:**
- `careers` (array) - Top 3 career recommendations with scores

---

#### `analyzePerformance(studentData)`
Detailed performance analysis.

```javascript
const analysis = await analyzePerformance({
  studentId: 'uuid',
  subjects: {
    math: [85, 88, 90],
    english: [78, 80, 82],
    science: [92, 90, 88]
  }
});
```

**Returns:**
- `analysis` (object) - Trends, strengths, weaknesses, interventions

---

## React Hooks

### Location: `src/hooks/`

#### `useAuth()`
Access authentication state and methods.

```javascript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, profile, login, register, logout, loading } = useAuth();

  return (
    <>
      {loading && <div>Loading...</div>}
      {user && <div>Welcome {profile?.first_name}</div>}
    </>
  );
}
```

**Returns:**
- `user` (object) - Supabase user object
- `profile` (object) - User profile from database
- `login(email, password)` - Login function
- `register(email, password, userData)` - Register function
- `logout()` - Logout function
- `loading` (boolean) - Loading state
- `error` (string) - Error message

---

#### `useAppData()`
Access application data.

```javascript
import { useAppData } from '@/hooks/useAppData';

function Dashboard() {
  const { 
    institution, 
    students, 
    dashboard, 
    loadDashboard 
  } = useAppData();

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div>
      <h1>{institution?.name}</h1>
      <p>Students: {students.length}</p>
    </div>
  );
}
```

**Returns:**
- `institution` (object) - Current institution
- `students` (array) - Student list
- `teachers` (array) - Teacher list
- `classes` (array) - Class list
- `dashboard` (object) - Dashboard stats

---

#### `useNotification()`
Show notifications.

```javascript
import { useNotification } from '@/hooks/useNotification';

function MyComponent() {
  const notification = useNotification();

  const handleSuccess = () => {
    notification.success('Operation completed!');
  };

  const handleError = () => {
    notification.error('Something went wrong!');
  };

  const handleWarning = () => {
    notification.warning('Please check this');
  };

  const handleInfo = () => {
    notification.info('New update available');
  };

  return (
    <div>
      <button onClick={handleSuccess}>Success</button>
      <button onClick={handleError}>Error</button>
      <button onClick={handleWarning}>Warning</button>
      <button onClick={handleInfo}>Info</button>
    </div>
  );
}
```

**Methods:**
- `success(message)` - Green success notification
- `error(message)` - Red error notification
- `warning(message)` - Amber warning notification
- `info(message)` - Blue info notification
- `addNotification(message, type)` - Generic notification

---

## Context APIs

### Location: `src/context/`

#### AuthContext
User authentication state.

```javascript
import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

function MyComponent() {
  const authContext = useContext(AuthContext);
  const { user, isAuthenticated, loading } = authContext;
  // ...
}
```

**State:**
- `user` - Supabase user
- `profile` - User profile object
- `isAuthenticated` - Boolean
- `loading` - Loading state
- `error` - Error message

---

#### AppDataContext
Global application data.

```javascript
import { useContext } from 'react';
import { AppDataContext } from '@/context/AppDataContext';

function MyComponent() {
  const appContext = useContext(AppDataContext);
  const { institution, students, dashboard } = appContext;
  // ...
}
```

**State:**
- `institution` - Institution details
- `students` - Students list
- `teachers` - Teachers list
- `classes` - Classes list
- `dashboard` - Dashboard stats

---

#### NotificationContext
Notification system.

```javascript
import { useContext } from 'react';
import { NotificationContext } from '@/context/NotificationContext';

function MyComponent() {
  const notifContext = useContext(NotificationContext);
  const { notifications, addNotification } = notifContext;
  // ...
}
```

**State:**
- `notifications` - Array of active notifications
- `addNotification(message, type)` - Show notification
- `removeNotification(id)` - Remove notification

---

## Helper Functions

### Location: `src/utils/helpers.js`

#### `formatCurrency(amount, currency)`
Format number as currency.

```javascript
formatCurrency(50000, 'INR'); // ₹50,000
formatCurrency(1000.50, 'USD'); // $1,000.50
```

---

#### `formatDate(date, format)`
Format date.

```javascript
formatDate('2024-07-01', 'MMM d, yyyy'); // Jul 1, 2024
formatDate('2024-07-01', 'EEEE'); // Monday
```

---

#### `formatTime(date)`
Format time.

```javascript
formatTime('2024-07-01 14:30:00'); // 2:30 PM
```

---

#### `calculateAttendancePercentage(present, total)`
Calculate attendance percentage.

```javascript
calculateAttendancePercentage(45, 50); // 90
```

---

#### `getInitials(email)`
Get user initials from email.

```javascript
getInitials('rahul@email.com'); // R
getInitials('john.doe@email.com'); // JD
```

---

#### `getStatusColor(status)`
Get color for status.

```javascript
getStatusColor('active'); // 'emerald'
getStatusColor('pending'); // 'amber'
getStatusColor('inactive'); // 'gray'
```

---

#### `getStatusBadge(status)`
Get badge styling for status.

```javascript
const badge = getStatusBadge('active');
// Returns: { color: 'bg-emerald...', label: 'Active' }
```

---

#### `validateEmail(email)`
Validate email format.

```javascript
validateEmail('user@example.com'); // true
validateEmail('invalid-email'); // false
```

---

#### `validatePhone(phone)`
Validate phone number.

```javascript
validatePhone('9876543210'); // true
validatePhone('123'); // false
```

---

#### `truncateText(text, length)`
Truncate text to length.

```javascript
truncateText('This is a long text', 10); // 'This is...'
```

---

#### `downloadJSON(data, filename)`
Download data as JSON file.

```javascript
downloadJSON({ name: 'Rahul' }, 'student.json');
```

---

#### `generateColor()`
Generate random color.

```javascript
generateColor(); // '#FF5733'
```

---

## Configuration

### Location: `src/config/index.js`

```javascript
// API URLs
API_BASE_URL
WS_URL
SUPABASE_URL
SUPABASE_KEY
OPENROUTER_API_KEY

// Feature Flags
FEATURES: {
  AI_ENABLED,
  LMS_ENABLED,
  TRANSPORT_TRACKING,
  REAL_TIME_NOTIFICATIONS
}

// Roles
ROLES: {
  SUPER_ADMIN,
  INSTITUTION_ADMIN,
  TEACHER,
  STUDENT,
  PARENT
}

// Colors
COLORS: {
  primary, light_blue, sky_blue, etc.
}

// Menu Items
MENU_ITEMS: {
  super_admin: [...],
  institution_admin: [...],
  teacher: [...],
  student: [...],
  parent: [...]
}
```

---

## Error Handling

All API calls return standard error format:

```javascript
{
  error: {
    message: 'Error description',
    code: 'ERROR_CODE',
    details: {...}
  }
}
```

Always check for errors:

```javascript
const { data, error } = await someFunction();

if (error) {
  console.error('Error:', error.message);
  notification.error(error.message);
  return;
}

// Use data
```

---

## Best Practices

1. **Always handle errors** - Check error object
2. **Use loading states** - Show loading indicators
3. **Validate inputs** - Use helper validation functions
4. **Cache appropriately** - Use localStorage for persistence
5. **Unsubscribe from listeners** - Prevent memory leaks
6. **Use proper types** - Follow object structures

---

## Rate Limits

- Supabase: 100 req/sec per project
- OpenRouter: Based on subscription tier
- Storage: 1 GB free per project

---

For more details, check individual file documentation and inline comments.

**Last Updated**: July 2024
