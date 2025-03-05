import Course from "@/app/components/courses/Course";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
  searchParams: Promise<{
    chapter?: string;
    lesson?: string;
  }>;
}

export default async function CoursePage({ params, searchParams }: CoursePageProps) {
  const { courseId } = await params;
  const { chapter, lesson } = await searchParams;

  return <Course params={{ courseId }} searchParams={{ chapter, lesson }} />;
}