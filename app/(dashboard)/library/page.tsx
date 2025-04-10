'use client';

import { useCourseService } from '@/services';
import { Header } from './Header';
import { useCourse } from '@/hooks';
import { useEffect, useState } from 'react';
import { FilterCourses } from './FilterCourses';
import { columns } from './columns';
import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { CounterBadge } from '@/components/badge/CounterBadge';
import { SearchBar } from './SearchBar';

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
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<{
    type: '' | 'title' | 'subject' | 'level';
    value: string;
  }>({
    type: '',
    value: '',
  });
  // Courses Search Bar
  const [search, setSearch] = useState<string>('');

  const applyCourseFilter = (
    courses: any[],
    filter: { type: 'title' | 'subject' | 'level' | ''; value: string },
    search: string
  ): any[] => {
    let result = [...courses];

    // Filtrage par filtre sélectionné (subject, level, title)
    if (filter.type && filter.value) {
      result = result.filter((course) =>
        course[filter.type]?.toLowerCase().includes(filter.value.toLowerCase())
      );
    }

    // Filtrage par recherche libre (sur plusieurs champs si besoin)
    if (search) {
      const loweredSearch = search.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(loweredSearch) ||
          course.subject.toLowerCase().includes(loweredSearch) ||
          course.level.toLowerCase().includes(loweredSearch)
      );
    }

    return result;
  };

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

  useEffect(() => {
    const result = applyCourseFilter(userCourses, filter, search);
    setFilteredCourses(result);
  }, [userCourses, filter, search]);

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
        <div className='flex items-center justify-start gap-1 w-full'>
          <FilterCourses
            coursesFilter={coursesFilter}
            activeFilter={filter}
            setActiveFilter={setFilter}
            isFilterOpen={isFilterOpen}
            setFilterOpen={setFilterOpen}
          />
          {/* if we have an active filter, we need to display a little text to reset it */}
          {filter.type && (
            <div className='flex items-center justify-start gap-2'>
              <Button
                variant='link'
                className='text-sm text-red-500'
                onClick={() => setFilter({ type: '', value: '' })}
              >
                Réinitialiser le filtre
              </Button>
            </div>
          )}
          {/* Counter Badge */}
          <div className='ml-2'>
            <CounterBadge
              counter={filteredCourses.length}
              type={'cours'}
              size='sm'
            />
          </div>
        </div>

        <SearchBar setSearch={setSearch} />
      </div>

      {/* Content Table */}
      <div className='flex items-center w-full'>
        <DataTable data={filteredCourses} columns={columns} />
      </div>
    </div>
  );
}
