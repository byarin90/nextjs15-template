'use client';

import { useRouter } from 'next/navigation';
import { CourseContent } from './CourseContent';
import { CourseSidebar } from './CourseSidebar';
import { Course } from '../types/course';

interface CourseWrapperProps {
  course: Course;
  currentChapter?: string;
  currentLesson?: string;
}

export function CourseWrapper({ course, currentChapter, currentLesson }: CourseWrapperProps) {
  const router = useRouter();

  const chapter = course.chapters.find(c => c.id === currentChapter);
  const lesson = chapter?.lessons.find(l => l.id === currentLesson);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="flex-1 overflow-hidden">
        <CourseContent
          currentChapter={chapter}
          currentLesson={lesson}
        />
      </div>
      <CourseSidebar
        course={{
          ...course,
          currentChapter: chapter?.id,
          currentLesson: lesson?.id
        }}
        onLessonSelect={(chapterId, lessonId) => {
          router.push(`/courses/${course.id}?chapter=${chapterId}&lesson=${lessonId}`);
        }}
      />
    </div>
  );
}
