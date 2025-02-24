import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { Course as CourseType } from './types/course';
import { CourseWrapper } from './components/CourseWrapper';

async function getCourse(courseId: string): Promise<CourseType> {
  // This is where you'd fetch the course data from your API or database
  // For now, we'll return mock data
  const course: CourseType = {
    id: courseId,
    title: "Example Course",
    currentChapter: "chapter1",
    currentLesson: "lesson1",
    chapters: [
      {
        id: "chapter1",
        title: "Getting Started",
        lessons: [
          {
            id: "lesson1",
            title: "Introduction to the Course",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "5:30",
            completed: true
          },
          {
            id: "lesson2",
            title: "Setting Up Your Environment",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "10:15"
          }
        ]
      },
      {
        id: "chapter2",
        title: "Core Concepts",
        lessons: [
          {
            id: "lesson3",
            title: "Understanding the Basics",
            videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            duration: "15:20"
          }
        ]
      }
    ]
  };

  return course;
}

interface CourseProps {
  params: {
    courseId: string;
  };
  searchParams: {
    chapter?: string;
    lesson?: string;
  };
}

export default async function Course({ params, searchParams }: CourseProps) {
  const course = await getCourse(params.courseId);

  if (!course) {
    notFound();
  }

  return (
    <Suspense fallback={<div>Loading course...</div>}>
      <CourseWrapper
        course={course}
        currentChapter={searchParams.chapter || course.currentChapter}
        currentLesson={searchParams.lesson || course.currentLesson}
      />
    </Suspense>
  );
}