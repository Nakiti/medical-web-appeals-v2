"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AuthModalProps = {
    redirectUrl: string;
    showModal: boolean;
    onClose?: () => void;
};

const AuthModal = ({ redirectUrl, showModal, onClose }: AuthModalProps) => {
    const router = useRouter();

    if (!showModal) return null;

    const handleLoginClick = () => {
        router.push(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`);
    };

    const handleRegisterClick = () => {
        router.push(`/register?redirectUrl=${encodeURIComponent(redirectUrl)}`);
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
        >
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <CardTitle id="auth-modal-title" className="text-center text-xl">
                        Sign in to continue
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-3">
                        <Button onClick={handleLoginClick} className="w-full">
                            Login
                        </Button>
                        <Button onClick={handleRegisterClick} variant="outline" className="w-full">
                            Register
                        </Button>
                        {onClose && (
                            <Button onClick={onClose} variant="ghost" className="w-full">
                                Maybe later
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AuthModal;