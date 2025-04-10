'use client';

import { useCourseService } from '@/services';
import { Header } from './Header';
import { useCourse } from '@/hooks';
import { useEffect, useState } from 'react';
import { FilterCourses } from './FilterCourses';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';

export default function LibraryPage() {
  // Basic Data
  const course_service = useCourseService();
  const { coursesData, loadAllCourses } = useCourse(course_service);
  const [userCourses, setUserCourses] = useState<any[]>([]);
  // Courses Filter
  const [coursesFilter, setCoursesFilter] = useState<{
    subjects: string[];
    levels: string[];
    titles: string[];
  }>({
    subjects: [],
    levels: [],
    titles: [],
  });
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    type: '' | 'title' | 'subject' | 'level';
    value: string;
  }>({
    type: '',
    value: '',
  });

  const getFilterFromCourses = () => {
    const subjects = new Set<string>();
    const levels = new Set<string>();
    const titles = new Set<string>();

    coursesData?.forEach((course) => {
      subjects.add(course.subject);
      levels.add(course.level);
      titles.add(course.title);
    });

    return {
      subjects: Array.from(subjects),
      levels: Array.from(levels),
      titles: Array.from(titles),
    };
  };

  useEffect(() => {
    if (coursesData && coursesData.length > 0) {
      const { subjects, levels, titles } = getFilterFromCourses();
      setCoursesFilter({ subjects, levels, titles });
    }
  }, [coursesData]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await loadAllCourses();
      await setUserCourses(
        response.map((course: any) => ({
          ...course,
          id: (course as any)._id || '',
          author: (course as any).author || 'Unknown',
          isPublished: (course as any).isPublished || false,
          createdAt: (course as any).createdAt || new Date().toISOString(),
        }))
      );
    };

    fetchCourses();
  }, []);

  if (!coursesData) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        Loading...
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2 lg:gap-6 px-2 lg:px-6 min-h-[calc(100vh-5rem)] w-full'>
      <Header
        title={`Ta bibliothèque`}
        description={`Ici tu retrouveras tous tes cours générés ainsi que tes favoris`}
      />
      {/* Filter + badge + searchbar */}
      <div className='w-full flex items-center justify-between gap-2'>
        <div className='flex items-center justify-start gap-2 w-full'>
          <FilterCourses
            coursesFilter={coursesFilter}
            activeFilter={filter}
            setActiveFilter={setFilter}
            isFilterOpen={isFilterOpen}
            setFilterOpen={setFilterOpen}
          />
        </div>
      </div>

      {/* Content Table */}
      <div className='flex items-center w-full'>
        <DataTable data={userCourses} columns={columns} />
      </div>
    </div>
  );
}
