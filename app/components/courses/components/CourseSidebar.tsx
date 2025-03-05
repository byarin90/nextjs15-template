'use client';

import { useState } from 'react';
import {  Course } from '../types/course';
import { cn } from '@/lib/utils';

interface CourseSidebarProps {
  course: Course;
  onLessonSelect: (chapterId: string, lessonId: string) => void;
}

export function CourseSidebar({ course, onLessonSelect }: CourseSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set([course.currentChapter || '']));

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(chapterId)) {
        newSet.delete(chapterId);
      } else {
        newSet.add(chapterId);
      }
      return newSet;
    });
  };

  return (
    <div className="w-full max-w-[400px] h-full overflow-y-auto border-l">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
        <div className="space-y-2">
          {course.chapters.map((chapter) => (
            <div key={chapter.id} className="border rounded-lg">
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full p-4 text-left flex items-center justify-between hover:bg-muted/50"
              >
                <span className="font-medium">{chapter.title}</span>
                <span className="transform transition-transform duration-200">
                  {expandedChapters.has(chapter.id) ? '▼' : '▶'}
                </span>
              </button>
              {expandedChapters.has(chapter.id) && (
                <div className="p-2">
                  {chapter.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => onLessonSelect(chapter.id, lesson.id)}
                      className={cn(
                        "w-full p-2 text-left text-sm hover:bg-muted/50 rounded flex items-center gap-2",
                        course.currentLesson === lesson.id && "bg-muted"
                      )}
                    >
                      <span className="w-5 h-5">
                        {lesson.completed ? '✓' : '○'}
                      </span>
                      <span>{lesson.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        {lesson.duration}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
