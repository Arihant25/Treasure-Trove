import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "../hooks/use-toast";

const ReviewDialog = ({ sellerId, sellerName, onReviewSubmitted, orderId }) => {
    const [existingReview, setExistingReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const checkExistingReview = async () => {
            try {
                const token = localStorage.getItem("token");
                const backendUrl = import.meta.env.VITE_BACKEND_URL;

                const response = await fetch(`${backendUrl}/api/reviews/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const reviews = await response.json();
                    const review = reviews.find((r) => r.targetUser === sellerId);
                    if (review) {
                        setExistingReview(review);
                        setRating(review.rating);
                        setComment(review.comment);
                    }
                }
            } catch (error) {
                console.error("Error checking existing review:", error);
            }
        };

        if (isOpen) {
            checkExistingReview();
        }
    }, [isOpen, sellerId]);

    const handleSubmitReview = async () => {
        try {
            const token = localStorage.getItem("token");
            const backendUrl = import.meta.env.VITE_BACKEND_URL;

            const endpoint = existingReview
                ? `${backendUrl}/api/reviews/${existingReview._id}`
                : `${backendUrl}/api/reviews/${sellerId}`;
            const method = existingReview ? "PUT" : "POST";

            const response = await fetch(endpoint, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    rating,
                    comment,
                    orderId,
                }),
            });

            if (!response.ok) {
                throw new Error(
                    existingReview ? "Failed to update review" : "Failed to add review"
                );
            }

            const successMessage = existingReview
                ? "Review updated successfully"
                : "Review added successfully";

            toast({
                title: "Success",
                description: successMessage,
            });

            setIsOpen(false);
            if (onReviewSubmitted) {
                onReviewSubmitted();
            }
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to submit review",
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    {existingReview ? "Edit Review" : "Add Review"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {existingReview ? "Edit" : "Add"} Review for {sellerName}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col space-y-4">
                    <div className="flex justify-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`h-8 w-8 ${star <= (hoveredRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    <Textarea
                        placeholder="Share your thoughts about the seller..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-32"
                    />
                    <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmitReview} disabled={!rating}>
                            Submit Review
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewDialog;