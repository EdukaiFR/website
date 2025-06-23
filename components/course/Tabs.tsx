type NavBarItem = {
    label: string;
    tab: string;
    component: React.FC<unknown>;
};

export type NavBar = NavBarItem[];
