type NavBarItem = {
  label: string;
  tab: string;
  component: React.FC<any>; // Ou un type plus précis
};

export type NavBar = NavBarItem[];
