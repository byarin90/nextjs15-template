'use client';

import { useRef } from 'react';
import { Chapter, Lesson } from '../types/course';

interface CourseContentProps {
  currentChapter?: Chapter;
  currentLesson?: Lesson;
}

export function CourseContent({ currentChapter, currentLesson }: CourseContentProps) {
  const videoRef = useRef<HTMLIFrameElement>(null);

  if (!currentChapter || !currentLesson) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground">Select a lesson to start learning</p>
      </div>
    );
  }

  // Function to extract video ID from various video URLs
  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:.*\/)?([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    return url;
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative w-full pt-[56.25%]">
        <iframe
          ref={videoRef}
          src={getVideoEmbedUrl(currentLesson.videoUrl)}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
        <p className="text-muted-foreground">
          {currentChapter.title} • {currentLesson.duration}
        </p>
      </div>
    </div>
  );
}
