import { useState } from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import GlassCard from '../../components/Common/GlassCard';
import Button from '../../components/Common/Button';
import { useNotification } from '../../hooks/useNotification';
import { MdAdd, MdPlayCircle, MdDescription } from 'react-icons/md';

export default function LmsPage() {
  const notification = useNotification();
  const [courses] = useState([
    { id: 1, name: 'Mathematics - Class 10', instructor: 'Mr. Sharma', students: 45, lessons: 12, assignments: 8, progress: 75 },
    { id: 2, name: 'English Literature', instructor: 'Ms. Singh', students: 42, lessons: 10, assignments: 6, progress: 60 },
    { id: 3, name: 'Science - Physics', instructor: 'Dr. Patel', students: 40, lessons: 15, assignments: 10, progress: 85 },
  ]);

  const [lessons] = useState([
    { id: 1, title: 'Introduction to Algebra', course: 'Mathematics - Class 10', type: 'video', duration: '45 mins', date: '2024-07-01' },
    { id: 2, title: 'Shakespeare Overview', course: 'English Literature', type: 'document', duration: '30 mins', date: '2024-07-02' },
    { id: 3, title: 'Newton\'s Laws of Motion', course: 'Science - Physics', type: 'video', duration: '50 mins', date: '2024-07-03' },
  ]);

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Learning Management System</h1>
          <Button variant="primary">
            <MdAdd className="mr-2 inline" /> Create Course
          </Button>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <GlassCard key={course.id} className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">{course.name}</h3>
                <p className="text-white/60 text-sm mb-4">By {course.instructor}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Students</span>
                    <span className="text-white">{course.students}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Lessons</span>
                    <span className="text-white">{course.lessons}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Assignments</span>
                    <span className="text-white">{course.assignments}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/60">Progress</span>
                    <span className="text-neon-cyan">{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-blue to-neon-cyan"
                      style={{width: `${course.progress}%`}}
                    ></div>
                  </div>
                </div>

                <Button variant="primary" className="w-full text-sm">
                  <MdPlayCircle className="mr-2 inline" /> Enter Course
                </Button>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Recent Lessons */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Lessons</h2>
          <div className="space-y-3">
            {lessons.map(lesson => (
              <div key={lesson.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  {lesson.type === 'video' ? (
                    <MdPlayCircle className="w-5 h-5 text-blue-400" />
                  ) : (
                    <MdDescription className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{lesson.title}</h3>
                  <p className="text-white/60 text-sm">{lesson.course}</p>
                  <p className="text-white/40 text-xs mt-1">{lesson.date} • {lesson.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </MainLayout>
  );
}
