import Link from 'next/link';

// This would typically come from your API or database
const courses = [
  {
    id: "course-1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development with HTML, CSS, and JavaScript",
    totalLessons: 12,
    duration: "6 hours"
  },
  {
    id: "course-2",
    title: "Advanced React Patterns",
    description: "Master advanced React patterns and best practices",
    totalLessons: 8,
    duration: "4 hours"
  },
  {
    id: "course-3",
    title: "Next.js 15 Masterclass",
    description: "Build modern web applications with Next.js 15",
    totalLessons: 15,
    duration: "8 hours"
  }
];

export default function Page() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course.id}
            href={`/courses/${course.id}`}
            className="block group"
          >
            <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
              <h2 className="text-2xl font-semibold mb-2 group-hover:text-blue-600">
                {course.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {course.description}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{course.totalLessons} lessons</span>
                <span>{course.duration}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}