import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, X } from "lucide-react"

const CaptchaChallenge = ({ isOpen, onSuccess, onClose }) => {
    const [answer, setAnswer] = useState("");
    const [num1] = useState(() => Math.floor(Math.random() * 10) + 1);
    const [num2] = useState(() => Math.floor(Math.random() * 10) + 1);
    const [error, setError] = useState(false);

    const handleSubmit = () => {
        const correctAnswer = num1 + num2;
        if (parseInt(answer) === correctAnswer) {
            setError(false);
            onSuccess();
        } else {
            setError(true);
        }
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
            <AlertDialogContent className="sm:max-w-md">
                <AlertDialogHeader>
                    <AlertDialogTitle>Additional Verification Required</AlertDialogTitle>
                    <AlertDialogDescription>
                        For security purposes, please solve this simple math problem:
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="text-lg text-center">
                        What is {num1} + {num2}?
                    </div>
                    <Input
                        type="number"
                        value={answer}
                        onChange={(e) => {
                            setAnswer(e.target.value);
                            setError(false);
                        }}
                        className={error ? "border-red-500" : ""}
                        placeholder="Enter your answer"
                    />
                    {error && (
                        <div className="text-red-500 text-sm flex items-center gap-2">
                            <X className="w-4 h-4" />
                            Incorrect answer, please try again
                        </div>
                    )}
                </div>

                <AlertDialogFooter className="flex gap-2 sm:gap-0">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="gap-2"
                    >
                        <Check className="w-4 h-4" />
                        Verify
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CaptchaChallenge;