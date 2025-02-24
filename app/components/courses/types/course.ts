export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  duration: string;
  completed?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  chapters: Chapter[];
  currentChapter?: string;
  currentLesson?: string;
}
