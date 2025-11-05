import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl border-0">
                <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        Accès non autorisé
                    </h1>

                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                            Vous n'avez pas les permissions nécessaires
                            pour accéder à cette page.
                        </p>
                    </div>

                    <p className="text-gray-600 mb-8">
                        Cette section est réservée aux administrateurs. Si vous
                        pensez qu'il s'agit d'une erreur,
                        contactez votre administrateur système.
                    </p>

                    <div className="space-y-3">
                        <Link href="/" className="block">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour à l'accueil
                            </Button>
                        </Link>

                        <Link href="/support" className="block">
                            <Button variant="outline" className="w-full">
                                Contacter le support
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
