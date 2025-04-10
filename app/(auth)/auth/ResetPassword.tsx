'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export type ResetPasswordProps = {
  setSelectedOption: (option: string) => void;
};

const resetPasswordSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ResetPassword = ({ setSelectedOption }: ResetPasswordProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormValues) => {
    console.log('Reset email sent to:', data.email);
    // Ici, tu pourrais déclencher un appel API vers Supabase ou autre
  };

  return (
    <section className='flex flex-col items-start justify-center w-full gap-4 my-5 xl:my-10'>
      {/* Header */}
      <div className='w-full text-center flex flex-col gap-1 items-center justify-start'>
        <h3 className='text-3xl text-[#3C517C] satoshi-bold'>
          Réinitialisation du mot de passe
        </h3>
        <p className='text-sm text-[#3678FF80] max-w-[80%]'>
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col w-full items-center gap-4 mt-3'
      >
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

        {/* Submit + retour */}
        <div className='flex flex-col gap-2 items-center w-[80%]'>
          <Button
            type='submit'
            className='mt-3 bg-[linear-gradient(-85deg,_#2D6BCF_0%,_#3678FF_100%)] w-full text-sm'
          >
            Envoyer le lien
          </Button>
          <Button
            variant='link'
            className='text-sm text-[#3678FF] hover:text-[#2D6BCF]'
            onClick={() => setSelectedOption('login')}
          >
            Retour à la connexion
          </Button>
        </div>
      </form>
    </section>
  );
};
