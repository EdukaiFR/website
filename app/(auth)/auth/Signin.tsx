import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

export type SigninProps = {
  setSelectedOption: (option: string) => void;
};

// Schéma de validation avec zod
const signinSchema = z.object({
  email: z.string().email('Adresse email invalide'),
  password: z
    .string()
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type SigninFormValues = z.infer<typeof signinSchema>;

export const Signin = ({ setSelectedOption }: SigninProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = (data: SigninFormValues) => {
    console.log('Form data:', data);
    // Ajoutez ici la logique pour gérer la soumission du formulaire
  };

  return (
    <section className='flex flex-col items-start justify-center w-full gap-4 my-5 xl:my-10'>
      {/* Header */}
      <div className='w-full text-center flex flex-col gap-1 items-center justify-start'>
        <h3 className='text-3xl text-[#3C517C] satoshi-bold'>
          Content de te revoir !
        </h3>
        <p className='text-sm text-[#3678FF80]'>
          Connecte-toi à ton compte pour accéder à ton espace personnel.
        </p>
      </div>

      {/* Formulaire */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='flex flex-col w-full items-center gap-4 mt-3'
      >
        {/* Champ Email */}
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

        {/* Champ Mot de passe */}
        <div className='flex flex-col gap-1 w-[80%]'>
          <label htmlFor='password' className='text-sm text-black'>
            Mot de passe
          </label>
          <Input
            id='password'
            type='password'
            placeholder='Entrez votre mot de passe'
            {...register('password')}
            className='bg-white autofill:bg-white'
          />
          {errors.password && (
            <p className='text-xs text-red-500'>{errors.password.message}</p>
          )}
          {/* Stay login & reset password link */}
          <div className='flex items-center justify-between w-full mt-0'>
            {/* Checkbox */}
            <div className='flex items-center space-x-2 cursor-pointer'>
              <Checkbox id='terms2' />
              <label
                htmlFor='terms2'
                className='text-sm font-medium leading-none  peer-disabled:opacity-70'
              >
                Se souvenir de moi
              </label>
            </div>

            {/* Reset password link */}
            <Button
              variant={'link'}
              className='text-sm text-[#3678FF] hover:text-[#2D6BCF]'
              onClick={() => setSelectedOption('forgot')}
            >
              Mot de passe oublié ?
            </Button>
          </div>
        </div>

        {/* Bouton de soumission */}
        <Button
          type='submit'
          className='bg-[linear-gradient(-85deg,_#2D6BCF_0%,_#3678FF_100%)] mt-3 w-[80%] text-sm'
        >
          Se connecter
        </Button>
      </form>
    </section>
  );
};
