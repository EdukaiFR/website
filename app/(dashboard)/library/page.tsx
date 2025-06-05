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
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Filter, Search, RotateCcw } from 'lucide-react';

// Define the extended course type for the table
interface ExtendedCourseData {
  _id?: string;
  id: string;
  title: string;
  subject: string;
  level: string;
  author: string;
  isPublished: boolean;
  createdAt: string;
  quizzes: string[];
  exams: string[];
  resumeFiles: unknown[];
}

export default function LibraryPage() {
  // Basic Data
  const course_service = useCourseService();
  const { coursesData, loadAllCourses } = useCourse(course_service);
  const [userCourses, setUserCourses] = useState<ExtendedCourseData[]>([]);
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
  const [filteredCourses, setFilteredCourses] = useState<ExtendedCourseData[]>([]);
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
    courses: ExtendedCourseData[],
    filter: { type: 'title' | 'subject' | 'level' | ''; value: string },
    search: string
  ): ExtendedCourseData[] => {
    // Safety check: ensure courses is an array
    if (!courses || !Array.isArray(courses)) {
      return [];
    }
    
    let result = [...courses];

    // Filtrage par filtre sélectionné (subject, level, title)
    if (filter.type && filter.value) {
      result = result.filter((course) => {
        if (filter.type === 'title') return course.title?.toLowerCase()?.includes(filter.value.toLowerCase());
        if (filter.type === 'subject') return course.subject?.toLowerCase()?.includes(filter.value.toLowerCase());
        if (filter.type === 'level') return course.level?.toLowerCase()?.includes(filter.value.toLowerCase());
        return false;
      });
    }

    // Filtrage par recherche libre (sur plusieurs champs si besoin)
    if (search) {
      const loweredSearch = search.toLowerCase();
      result = result.filter(
        (course) => 
          course.title?.toLowerCase()?.includes(loweredSearch) ||
          course.subject?.toLowerCase()?.includes(loweredSearch) ||
          course.level?.toLowerCase()?.includes(loweredSearch)
      );
    }

    return result;
  };

  const getFilterFromCourses = () => {
    const subjects = new Set<string>();
    const levels = new Set<string>();
    const titles = new Set<string>();

    // Safety check: ensure coursesData is an array
    if (coursesData && Array.isArray(coursesData)) {
      coursesData.forEach((course) => {
        if (course?.subject) subjects.add(course.subject);
        if (course?.level) levels.add(course.level);
        if (course?.title) titles.add(course.title);
      });
    }

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
      
      // Check if response is null or not an array
      if (response && Array.isArray(response)) {
        const extendedCourses: ExtendedCourseData[] = response.map((course) => ({
          ...course,
          id: (course as any)._id || '',
          author: (course as any).author || 'Unknown',
          isPublished: (course as any).isPublished || false,
          createdAt: (course as any).createdAt || new Date().toISOString(),
        }));
        setUserCourses(extendedCourses);
      } else {
        // If response is null or not an array, set empty array
        console.warn('Failed to load courses or received invalid response');
        setUserCourses([]);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const result = applyCourseFilter(userCourses, filter, search);
    setFilteredCourses(result);
  }, [userCourses, filter, search]);

  if (!coursesData) {
    return (
      <div className='flex items-center justify-center w-full h-full min-h-[60vh]'>
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-muted-foreground">Chargement de vos cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-6 px-4 lg:px-8 py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50'>
      {/* Modern Header with gradient background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              Bibliothèque
            </div>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">Ta bibliothèque</h1>
          <p className="text-blue-100 text-base lg:text-lg max-w-2xl">
            Ici tu retrouveras tous tes cours générés ainsi que tes favoris
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 right-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg"></div>
      </div>

      {/* Modern Filter and Search Section */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
            <div className='flex items-center gap-3 flex-wrap'>
              <FilterCourses
                coursesFilter={coursesFilter}
                activeFilter={filter}
                setActiveFilter={setFilter}
                isFilterOpen={isFilterOpen}
                setFilterOpen={setFilterOpen}
              />
              
              {filter.type && (
                <Button
                  variant='outline'
                  size="sm"
                  className='text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300'
                  onClick={() => setFilter({ type: '', value: '' })}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              )}
              
              <CounterBadge
                counter={filteredCourses.length}
                type={'cours'}
                size='sm'
              />
            </div>

            <div className="w-full lg:w-auto lg:max-w-[350px] flex justify-end">
              <div className="w-full lg:w-[300px]">
                <SearchBar setSearch={setSearch} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modern Content Table */}
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm flex-1">
        <CardContent className="p-6">
          <div className='w-full'>
            <DataTable data={filteredCourses} columns={columns} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
