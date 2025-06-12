'use client';

import { SortableHeader } from '@/components/data-table/SortableHeader';
import { formatDate } from '@/lib/date-format';
import { ColumnDef } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import Link from 'next/link';

export type CourseDataType = {
  id: string;
  author: string;
  isPublished: boolean;
  level: string;
  subject: string;
  title: string;
  createdAt: string;
};

export const columns: ColumnDef<CourseDataType>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title='Nom'
        className='w-[50px] satoshi-medium'
      />
    ),
    cell: ({ row }) => (
      <p className='satoshi-medium'>{row.getValue('title')}</p>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'subject',
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title='Matière'
        className='w-[50px] satoshi-medium'
      />
    ),
    cell: ({ row }) => (
      <p className='satoshi-medium'>
        {row.getValue('subject')}
        {/* {formatDate(
          new Date(row.getValue('added_at') as string).toLocaleDateString(
            'fr-FR'
          )
        )} */}
      </p>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'level',
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title='Niveau'
        className='w-[50px] satoshi-medium'
      />
    ),
    cell: ({ row }) => (
      <p className='satoshi-medium'>{row.getValue('level')}</p>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'author',
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title='Auteur'
        className='w-[50px] satoshi-medium'
      />
    ),
    cell: ({ row }) => (
      <p className='satoshi-medium'>{row.getValue('author')}</p>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title='Date de création'
        className='w-[50px] satoshi-medium'
      />
    ),
    cell: ({ row }) => (
      <p className='satoshi-medium'>
        {formatDate(
          new Date(row.getValue('createdAt') as string).toLocaleDateString(
            'fr-FR'
          )
        )}
      </p>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'actions',
    header: () => (
      <div className='w-full flex justify-end items-center satoshi-medium'>
        Actions
      </div>
    ), // Aligner le titre à droite
    cell: ({ row }) => (
      <div className='flex justify-end w-full'>
        <Link
          href={`/library/${row.original.id}`} // ✅ récupère l'id ici
          className='flex items-center justify-center p-2'
        >
          <Eye className='w-4 h-4' />
        </Link>
      </div>
    ),
  },
];
