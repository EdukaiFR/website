'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export type SignupProps = {
  setSelectedOption: (option: string) => void;
};

// Validation schema
const signupSchema = z
  .object({
    firstName: z.string().min(2, 'Prénom requis'),
    lastName: z.string().min(2, 'Nom requis'),
    email: z.string().email('Adresse email invalide'),
    password: z
      .string()
      .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export const Signup = ({ setSelectedOption }: SignupProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormValues) => {
    console.log('Form data:', data);
    // Logic d’inscription ici
  };

  return (
    <section className='flex flex-col items-start justify-center w-full gap-4 my-3'>
      {/* Header */}
      <div className='w-full text-center flex flex-col gap-1 items-center justify-start'>
        <h3 className='text-3xl text-[#3C517C] satoshi-bold'>
          Bienvenue sur Edukai !
        </h3>
        <p className='text-sm text-[#3678FF80]'>
          Crée un compte pour commencer à apprendre dès maintenant.
        </p>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col w-full items-center gap-2 mt-1'
      >
        {/* Prénom + Nom */}
        <div className='flex flex-col md:flex-row w-[80%] gap-2'>
          {/* Prénom */}
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor='firstName' className='text-sm text-black'>
              Prénom
            </label>
            <Input
              id='firstName'
              placeholder='Entrez votre prénom'
              {...register('firstName')}
              className='bg-white autofill:bg-white'
            />
            {errors.firstName && (
              <p className='text-xs text-red-500'>{errors.firstName.message}</p>
            )}
          </div>

          {/* Nom */}
          <div className='flex flex-col gap-1 w-full'>
            <label htmlFor='lastName' className='text-sm text-black'>
              Nom
            </label>
            <Input
              id='lastName'
              placeholder='Entrez votre nom'
              {...register('lastName')}
              className='bg-white autofill:bg-white'
            />
            {errors.lastName && (
              <p className='text-xs text-red-500'>{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className='flex flex-col gap-1 w-[80%]'>
          <label htmlFor='email' className='text-sm text-black'>
            Adresse email
          </label>
          <Input
            id='email'
            type='email'
            placeholder='Entrez votre email'
            {...register('email')}
            className='bg-white autofill:bg-white'
          />
          {errors.email && (
            <p className='text-xs text-red-500'>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className='flex flex-col gap-1 w-[80%]'>
          <label htmlFor='password' className='text-sm text-black'>
            Mot de passe
          </label>
          <Input
            id='password'
            type='password'
            placeholder='Mot de passe'
            {...register('password')}
            className='bg-white autofill:bg-white'
          />
          {errors.password && (
            <p className='text-xs text-red-500'>{errors.password.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className='flex flex-col gap-1 w-[80%]'>
          <label htmlFor='confirmPassword' className='text-sm text-black'>
            Confirmer le mot de passe
          </label>
          <Input
            id='confirmPassword'
            type='password'
            placeholder='Confirmer le mot de passe'
            {...register('confirmPassword')}
            className='bg-white autofill:bg-white'
          />
          {errors.confirmPassword && (
            <p className='text-xs text-red-500'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit + retour login */}
        <div className='flex flex-col gap-2 items-center w-[80%]'>
          <Button
            type='submit'
            className='mt-3 bg-[linear-gradient(-85deg,_#2D6BCF_0%,_#3678FF_100%)] w-full text-sm'
          >
            Créer mon compte
          </Button>
        </div>
      </form>
    </section>
  );
};
