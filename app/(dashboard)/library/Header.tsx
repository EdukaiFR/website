export type HeaderProps = {
  title: string;
  description: string;
};

export const Header = (props: HeaderProps) => {
  return (
    <div className="flex flex-col items-start justify-start w-full gap-0">
      <h1 className="text-[#1A202C] text-base lg:text-xl font-semibold w-full">
        {props.title}
      </h1>
      <p className="text-[#90B4FF] text-sm lg:text-base w-full">
        {props.description}
      </p>
    </div>
  );
};
