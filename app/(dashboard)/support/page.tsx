"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Clock,
    CreditCard,
    ExternalLink,
    FileText,
    HelpCircle,
    LifeBuoy,
    Mail,
    MessageCircle,
    Search,
    Send,
    Settings,
    Shield,
    Smartphone,
    User,
    Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type HelpCategory = {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    articles: number;
    color: string;
};

type FAQ = {
    id: string;
    question: string;
    answer: string;
    category: string;
    helpful: number;
};

type ContactReason = {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
};

const helpCategories: HelpCategory[] = [
    {
        id: "getting-started",
        title: "Premiers pas",
        description: "Découvre comment utiliser Edukai efficacement",
        icon: BookOpen,
        articles: 8,
        color: "bg-blue-50 border-blue-200 text-blue-700",
    },
    {
        id: "courses",
        title: "Cours et Quiz",
        description: "Tout sur la création et gestion de tes cours",
        icon: FileText,
        articles: 12,
        color: "bg-green-50 border-green-200 text-green-700",
    },
    {
        id: "account",
        title: "Mon compte",
        description: "Paramètres, profil et sécurité",
        icon: User,
        articles: 6,
        color: "bg-purple-50 border-purple-200 text-purple-700",
    },
    {
        id: "subscription",
        title: "Abonnement",
        description: "Facturation, plans et fonctionnalités Premium",
        icon: CreditCard,
        articles: 5,
        color: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    {
        id: "technical",
        title: "Problèmes techniques",
        description: "Bugs, problèmes de connexion et performance",
        icon: Settings,
        articles: 9,
        color: "bg-red-50 border-red-200 text-red-700",
    },
    {
        id: "mobile",
        title: "Application mobile",
        description: "Utilisation sur smartphone et tablette",
        icon: Smartphone,
        articles: 4,
        color: "bg-indigo-50 border-indigo-200 text-indigo-700",
    },
];

const faqs: FAQ[] = [
    {
        id: "1",
        question: "Comment créer mon premier cours ?",
        answer: "Pour créer ton premier cours, va dans la section 'Générer' et télécharge tes documents (PDF, images, etc.). Notre IA analysera automatiquement le contenu et créera un cours personnalisé avec des quiz adaptés. Le processus prend généralement 2-3 minutes.",
        category: "getting-started",
        helpful: 42,
    },
    {
        id: "2",
        question: "Puis-je modifier mes cours après création ?",
        answer: "Oui ! Tu peux modifier le contenu de tes cours, ajouter des notes personnelles, créer des examens personnalisés, et organiser tes fiches de révision. Va dans ta bibliothèque et clique sur le cours que tu veux modifier.",
        category: "courses",
        helpful: 38,
    },
    {
        id: "3",
        question:
            "Quelle est la différence entre la version gratuite et Premium ?",
        answer: "La version gratuite te permet de créer 3 cours par mois avec des fonctionnalités de base. Premium débloque la création illimitée, l'IA avancée, les statistiques détaillées, le partage de cours, et l'accès prioritaire aux nouvelles fonctionnalités.",
        category: "subscription",
        helpful: 56,
    },
    {
        id: "4",
        question: "Mes données sont-elles sécurisées ?",
        answer: "Absolument ! Nous utilisons un chiffrement de niveau bancaire (AES-256) pour protéger tes données. Tes documents et cours sont stockés de manière sécurisée et ne sont jamais partagés avec des tiers. Tu peux consulter notre politique de confidentialité pour plus de détails.",
        category: "account",
        helpful: 29,
    },
    {
        id: "5",
        question: "L'application fonctionne-t-elle hors ligne ?",
        answer: "Tu peux consulter tes cours téléchargés hors ligne sur l'application mobile. Cependant, la création de nouveaux cours et la synchronisation nécessitent une connexion internet.",
        category: "mobile",
        helpful: 33,
    },
    {
        id: "6",
        question: "Comment puis-je annuler mon abonnement ?",
        answer: "Tu peux annuler ton abonnement à tout moment dans tes paramètres de compte. Va dans 'Paramètres' > 'Abonnement' > 'Gérer l'abonnement'. L'annulation prend effet à la fin de la période de facturation en cours.",
        category: "subscription",
        helpful: 21,
    },
];

const contactReasons: ContactReason[] = [
    {
        id: "bug",
        title: "Signaler un bug",
        description: "Quelque chose ne fonctionne pas comme prévu",
        icon: Zap,
    },
    {
        id: "feature",
        title: "Demande de fonctionnalité",
        description: "Suggérer une amélioration ou nouvelle fonctionnalité",
        icon: HelpCircle,
    },
    {
        id: "billing",
        title: "Question de facturation",
        description: "Problème avec ton abonnement ou paiement",
        icon: CreditCard,
    },
    {
        id: "content",
        title: "Problème de contenu",
        description: "Cours généré incorrectement ou contenu inapproprié",
        icon: FileText,
    },
    {
        id: "account",
        title: "Compte utilisateur",
        description: "Problème de connexion, mot de passe ou profil",
        icon: User,
    },
    {
        id: "other",
        title: "Autre",
        description: "Une question qui ne rentre dans aucune catégorie",
        icon: MessageCircle,
    },
];

export default function SupportPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [openFAQ, setOpenFAQ] = useState<string | null>(null);
    const [contactForm, setContactForm] = useState({
        name: "",
        email: "",
        reason: "",
        subject: "",
        message: "",
    });

    const filteredFAQs = faqs.filter(faq => {
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory =
            !selectedCategory || faq.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !contactForm.name ||
            !contactForm.email ||
            !contactForm.subject ||
            !contactForm.message
        ) {
            toast.error("Veuillez remplir tous les champs obligatoires");
            return;
        }

        // Simulate form submission
        toast.success(
            "Votre message a été envoyé ! Nous vous répondrons sous 24h."
        );
        setContactForm({
            name: "",
            email: "",
            reason: "",
            subject: "",
            message: "",
        });
    };

    return (
        <div className="flex flex-col gap-6 px-4 lg:px-8 py-4 lg:py-6 min-h-[calc(100vh-5rem)] w-full bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 p-6 lg:p-8 text-white shadow-xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
                        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                            <LifeBuoy className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                        </div>
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 px-3 py-1 w-fit">
                            Support 24/7
                        </Badge>
                    </div>
                    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">
                        Centre d'assistance
                    </h1>
                    <p className="text-blue-100 text-sm sm:text-base lg:text-lg max-w-2xl">
                        Trouve des réponses rapides ou contacte notre équipe
                        pour une aide personnalisée.
                    </p>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full blur-xl"></div>
                <div className="absolute bottom-4 right-8 w-16 h-16 lg:w-20 lg:h-20 bg-purple-300/20 rounded-full blur-lg"></div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-200">
                    <CardContent className="p-4 lg:p-6 text-center">
                        <div className="p-3 bg-blue-50 rounded-2xl w-fit mx-auto mb-4">
                            <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
                        </div>
                        <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">
                            Chat en direct
                        </h3>
                        <p className="text-gray-600 text-xs lg:text-sm mb-4">
                            Discute avec notre équipe en temps réel
                        </p>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base">
                            Ouvrir le chat
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-200">
                    <CardContent className="p-4 lg:p-6 text-center">
                        <div className="p-3 bg-green-50 rounded-2xl w-fit mx-auto mb-4">
                            <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
                        </div>
                        <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">
                            Email
                        </h3>
                        <p className="text-gray-600 text-xs lg:text-sm mb-4">
                            Envoie-nous un email détaillé
                        </p>
                        <Button
                            variant="outline"
                            className="w-full border-gray-200 text-gray-700 hover:bg-gray-50 text-sm lg:text-base"
                            onClick={() =>
                                window.open("mailto:support@edukai.fr")
                            }
                        >
                            <span className="hidden sm:inline">
                                support@edukai.fr
                            </span>
                            <span className="sm:hidden">Email</span>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0 hover:shadow-xl transition-all duration-200 sm:col-span-2 lg:col-span-1">
                    <CardContent className="p-4 lg:p-6 text-center">
                        <div className="p-3 bg-purple-50 rounded-2xl w-fit mx-auto mb-4">
                            <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
                        </div>
                        <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">
                            Horaires
                        </h3>
                        <p className="text-gray-600 text-xs lg:text-sm mb-2">
                            Lun-Ven: 9h-18h
                        </p>
                        <p className="text-gray-600 text-xs lg:text-sm">
                            Sam-Dim: 10h-16h
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Categories */}
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                <CardContent className="p-4 lg:p-6">
                    <div className="flex flex-col gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                placeholder="Rechercher dans l'aide..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-10 bg-white/50 border-gray-200 text-sm lg:text-base"
                            />
                        </div>

                        {/* Categories */}
                        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
                            {helpCategories.map(category => (
                                <Button
                                    key={category.id}
                                    variant="outline"
                                    onClick={() =>
                                        setSelectedCategory(
                                            selectedCategory === category.id
                                                ? null
                                                : category.id
                                        )
                                    }
                                    className={`h-auto p-3 lg:p-4 flex flex-col items-center gap-2 text-xs lg:text-sm ${
                                        selectedCategory === category.id
                                            ? "bg-blue-50 border-blue-200 text-blue-700"
                                            : "border-gray-200 hover:bg-gray-50"
                                    }`}
                                >
                                    <div
                                        className={`p-1.5 lg:p-2 rounded-lg ${category.color}`}
                                    >
                                        <category.icon className="w-3 h-3 lg:w-4 lg:h-4" />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-semibold text-xs">
                                            {category.title}
                                        </div>
                                        <div className="text-xs text-gray-500 hidden sm:block">
                                            {category.articles} articles
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                <CardHeader className="p-4 lg:p-6">
                    <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 text-base lg:text-lg">
                        <div className="flex items-center gap-2">
                            <HelpCircle className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                            Questions fréquentes
                        </div>
                        {selectedCategory && (
                            <Badge
                                variant="secondary"
                                className="w-fit text-xs"
                            >
                                {
                                    helpCategories.find(
                                        c => c.id === selectedCategory
                                    )?.title
                                }
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                    {filteredFAQs.length === 0 ? (
                        <div className="text-center py-6 lg:py-8">
                            <HelpCircle className="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-base lg:text-lg font-semibold text-gray-800 mb-2">
                                Aucune question trouvée
                            </h3>
                            <p className="text-gray-500 text-sm lg:text-base">
                                Essaie avec d'autres mots-clés ou contacte
                                notre équipe.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {filteredFAQs.map(faq => (
                                <Collapsible
                                    key={faq.id}
                                    open={openFAQ === faq.id}
                                    onOpenChange={open =>
                                        setOpenFAQ(open ? faq.id : null)
                                    }
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-between p-3 lg:p-4 h-auto text-left hover:bg-gray-50 border border-gray-200 rounded-lg"
                                        >
                                            <div className="flex items-start justify-between w-full gap-2">
                                                <span className="font-semibold text-gray-800 text-sm lg:text-base text-left pr-2">
                                                    {faq.question}
                                                </span>
                                                <div className="flex items-center gap-1 lg:gap-2 shrink-0">
                                                    <Badge
                                                        variant="secondary"
                                                        className="text-xs hidden sm:inline-flex"
                                                    >
                                                        {faq.helpful} 👍
                                                    </Badge>
                                                    <ChevronDown
                                                        className={`w-4 h-4 transition-transform ${
                                                            openFAQ === faq.id
                                                                ? "rotate-180"
                                                                : ""
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-3 lg:px-4 py-3 text-gray-600 leading-relaxed border border-t-0 border-gray-200 rounded-b-lg text-sm lg:text-base">
                                        {faq.answer}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-xs lg:text-sm text-gray-500">
                                                Cette réponse était-elle utile ?
                                            </span>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-green-200 text-green-700 hover:bg-green-50 text-xs lg:text-sm"
                                                    onClick={() =>
                                                        toast.success(
                                                            "Merci pour votre retour !"
                                                        )
                                                    }
                                                >
                                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                                    Oui
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-gray-200 text-gray-700 hover:bg-gray-50 text-xs lg:text-sm"
                                                    onClick={() =>
                                                        toast.info(
                                                            "Nous allons améliorer cette réponse"
                                                        )
                                                    }
                                                >
                                                    Non
                                                </Button>
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </Collapsible>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                <CardHeader className="p-4 lg:p-6">
                    <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                        <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                        Contacter l'équipe support
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 lg:p-6 pt-0">
                    <form
                        onSubmit={handleContactSubmit}
                        className="space-y-4 lg:space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-sm lg:text-base"
                                >
                                    Nom complet *
                                </Label>
                                <Input
                                    id="name"
                                    value={contactForm.name}
                                    onChange={e =>
                                        setContactForm(prev => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className="bg-white/50 border-gray-200 text-sm lg:text-base"
                                    placeholder="Ton nom"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-sm lg:text-base"
                                >
                                    Email *
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={contactForm.email}
                                    onChange={e =>
                                        setContactForm(prev => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    className="bg-white/50 border-gray-200 text-sm lg:text-base"
                                    placeholder="ton@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="reason"
                                className="text-sm lg:text-base"
                            >
                                Type de demande
                            </Label>
                            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2">
                                {contactReasons.map(reason => (
                                    <Button
                                        key={reason.id}
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            setContactForm(prev => ({
                                                ...prev,
                                                reason: reason.id,
                                            }))
                                        }
                                        className={`h-auto p-2 lg:p-3 flex flex-col sm:flex-row lg:flex-col items-center gap-2 ${
                                            contactForm.reason === reason.id
                                                ? "bg-blue-50 border-blue-200 text-blue-700"
                                                : "border-gray-200 hover:bg-gray-50"
                                        }`}
                                    >
                                        <reason.icon className="w-4 h-4 shrink-0" />
                                        <div className="text-center sm:text-left lg:text-center">
                                            <div className="font-semibold text-xs lg:text-sm">
                                                {reason.title}
                                            </div>
                                        </div>
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="subject"
                                className="text-sm lg:text-base"
                            >
                                Sujet *
                            </Label>
                            <Input
                                id="subject"
                                value={contactForm.subject}
                                onChange={e =>
                                    setContactForm(prev => ({
                                        ...prev,
                                        subject: e.target.value,
                                    }))
                                }
                                className="bg-white/50 border-gray-200 text-sm lg:text-base"
                                placeholder="Décris brièvement ton problème"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="message"
                                className="text-sm lg:text-base"
                            >
                                Message *
                            </Label>
                            <Textarea
                                id="message"
                                value={contactForm.message}
                                onChange={e =>
                                    setContactForm(prev => ({
                                        ...prev,
                                        message: e.target.value,
                                    }))
                                }
                                className="bg-white/50 border-gray-200 min-h-[100px] lg:min-h-[120px] text-sm lg:text-base"
                                placeholder="Décris ton problème en détail. Plus tu donnes d'informations, plus nous pourrons t'aider efficacement."
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm lg:text-base h-10 lg:h-11"
                        >
                            <Send className="w-4 h-4 mr-2" />
                            Envoyer le message
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Resources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                    <CardHeader className="p-4 lg:p-6">
                        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                            <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-blue-600" />
                            Ressources utiles
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
                        <Button
                            variant="outline"
                            className="w-full justify-between border-gray-200 hover:bg-gray-50 text-sm lg:text-base h-10 lg:h-11"
                            onClick={() =>
                                window.open("/guide-utilisateur", "_blank")
                            }
                        >
                            <span>Guide d'utilisation complet</span>
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-between border-gray-200 hover:bg-gray-50 text-sm lg:text-base h-10 lg:h-11"
                            onClick={() =>
                                window.open("/video-tutorials", "_blank")
                            }
                        >
                            <span>Tutoriels vidéo</span>
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-between border-gray-200 hover:bg-gray-50 text-sm lg:text-base h-10 lg:h-11"
                            onClick={() => window.open("/api-docs", "_blank")}
                        >
                            <span>Documentation API</span>
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-white/70 backdrop-blur-sm shadow-lg border-0">
                    <CardHeader className="p-4 lg:p-6">
                        <CardTitle className="flex items-center gap-2 text-base lg:text-lg">
                            <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-green-600" />
                            Statut du service
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 lg:p-6 pt-0 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs lg:text-sm font-medium text-green-800">
                                    Tous les services opérationnels
                                </span>
                            </div>
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-between border-gray-200 hover:bg-gray-50 text-sm lg:text-base h-10 lg:h-11"
                            onClick={() => window.open("/status", "_blank")}
                        >
                            <span>Voir le statut détaillé</span>
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
