import Course from "@/app/components/courses/Course";

interface CoursePageProps {
  params: {
    courseId: string;
  };
  searchParams: {
    chapter?: string;
    lesson?: string;
  };
}

export default function CoursePage({ params, searchParams }: CoursePageProps) {
  return <Course params={params} searchParams={searchParams} />;
}
