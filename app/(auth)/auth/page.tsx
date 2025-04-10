'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Signin } from './Signin';
import { Signup } from './Signup';
import { ResetPassword } from './ResetPassword';
import { Button } from '@/components/ui/button';

export default function Authpage() {
  const [selectedOption, setSelectedOption] = useState('login');
  return (
    <div className='relative w-full max-w-[90%] xl:max-w-[75%] flex items-center justify-center gap-0 bg-white p-4 rounded-lg border border-[#E3E3E7] overflow-hidden'>
      {/* Left part with inputs */}
      <div className='flex flex-col items-start justify-between w-full gap-10 z-10'>
        {/* Header */}
        <div className='flex items-end justify-start w-full gap-2'>
          <Image
            src={'/EdukaiLogo.svg'}
            alt='Logo Edukai'
            width={30}
            height={30}
            className='rounded-full'
          />
          <h1 className='text-md font-bold text-[#2D6BCF]'>Edukai</h1>
        </div>

        {/* Content */}
        <div className='w-full xl:w-[50%]'>
          {selectedOption === 'login' && (
            <Signin setSelectedOption={setSelectedOption} />
          )}
          {selectedOption === 'register' && (
            <Signup setSelectedOption={setSelectedOption} />
          )}
          {selectedOption === 'forgot' && (
            <ResetPassword setSelectedOption={setSelectedOption} />
          )}
        </div>

        {/* Footer */}
        <div className='text-muted-foreground text-sm flex items-center justify-center gap-2 w-full xl:w-[50%] mt-auto'>
          {selectedOption === 'login' && (
            <Button
              variant={'link'}
              onClick={() => setSelectedOption('register')}
              className='text-sm text-[#3678FF] cursor-pointer'
            >
              Vous n'avez pas de compte ?{' '}
            </Button>
          )}
          {selectedOption === 'register' && (
            <Button
              variant={'link'}
              onClick={() => setSelectedOption('login')}
              className='text-sm text-[#3678FF] cursor-pointer'
            >
              Vous avez déjà un compte ?{' '}
            </Button>
          )}
        </div>
      </div>

      {/* RightPart with screen */}
      <div className='absolute hidden xl:flex right-0 top-0 bottom-0 w-1/2 bg-[linear-gradient(-85deg,_#2D6BCF_0%,_#3678FF_100%)] rounded-r-md' />
      <p className='absolute hidden xl:flex left-[52%] top-[10%] satoshi-bold text-2xl text-white max-w-[35%] text-left'>
        Révise mieux, pas plus.
      </p>
      <p className='absolute hidden xl:flex left-[52%] top-[18%] text-white max-w-[35%] text-left'>
        Upload ton cours, attends 20 secondes et entraînes-toi sur des questions
        générées automatiquement !
      </p>
      <Image
        src={'/preview/openCourse.svg'}
        width={500}
        height={500}
        alt='Preview'
        className='absolute hidden xl:flex -right-[7%] bottom-[5%] w-[55%] max-w-[700px] opacity-100 rounded-l-lg shadow-lg'
      />
      {/* <Image
        src={'/preview/generatorForm.svg'}
        width={500}
        height={500}
        alt='Preview'
        className='absolute hidden xl:flex right-[5%] bottom-[43%] w-[25%] opacity-100 rounded-lg shadow-xl'
      /> */}
    </div>
  );
}
