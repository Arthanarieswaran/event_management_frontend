
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Badge } from '@/components/ui/badge';

type EventCardProps = {
    title: string;
    location: string;
    date: string;
    time: string;
    capacity: number;
    availability: number;
};

export default function EventCard({
    title,
    location,
    date,
    time,
    capacity,
    availability,
}: EventCardProps) {
    return (
        <Card
            className="max-w-xl mx-auto shadow-lg border border-muted mb-6"
            style={{ backgroundColor: "rgb(109 161 247 / 50%)" }}
        >
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">{title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Illustration Placeholder */}
                <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-muted-foreground">[Illustration Here]</span>
                </div>

                {/* Event Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                    <p><strong>📍 Location:</strong> {location}</p>
                    <p><strong>🗓 Date:</strong> {date}</p>
                    <p><strong>⏰ Time:</strong> {time}</p>
                    <p><strong>👥 Capacity:</strong> {capacity}</p>
                    <p>
                        <strong>✅ Availability:</strong>{" "}
                        <Badge variant="outline">{availability}</Badge>
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between pt-4">
                    <Button variant="default">Register</Button>
                    <Button variant="outline">View Attendees</Button>
                </div>
            </CardContent>
        </Card>
    );
}