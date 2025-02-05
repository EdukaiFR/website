import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="outfit-regular w-full flex flex-col gap-6 items-center justify-center pb-[1.5%] lg:pb-[3%] pt-[10%] lg:pt-0">
      <div className="flex flex-col items-center justify-center text-center outfit-regular">
        {/* <Badge className="flex items-center justify-center gap-4 outfit-regular text-xs text-primary-500 px-[3%] py-[1%] rounded-full border-1 border-primary-500 bg-primary-500 bg-opacity-25 hover:bg-primary-500 hover:bg-opacity-25 hover:border-1 hover:border-primary-500">
            <Image src={"/icons/stars.svg"} width={20} height={20} alt="Stars" />
            Dès Juillet 2025
          </Badge> */}
        <h3 className="text-4xl lg:text-8xl text-white w-full">
          Révise Mieux,
        </h3>
        <h3 className="text-4xl lg:text-8xl text-primary-500 w-full">
          Pas Plus
        </h3>
        <p className="text-white text-opacity-75 text-xs lg:text-md text-center w-full outfit-regular mt-[2%]">
          Des fiches de révision et des quiz interactifs pour booster votre
          apprentissage en un clin d'œil, le tout basé sur votre cours
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-5 w-full">
        <Button className="rounded-full outfit-regular text-xs lg:text-sm text-white px-[20%] py-[5%] lg:px-[2%] lg:py-[1.5%]">
          Rester informé
        </Button>
        <Button
          variant={"outline"}
          className="rounded-full outfit-regular text-xs lg:text-sm text-white px-[20%] py-[5%] lg:px-[2%] lg:py-[1.5%] bg-transparent border-2 border-white text-white hover:bg-primary-500 hover:text-white hover:border-transparent"
        >
          Nous contacter
        </Button>
      </div>
    </div>
  );
}
