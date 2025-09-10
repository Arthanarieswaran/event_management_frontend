"use client";

import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toast } from "@radix-ui/react-toast";

export default function CreateEvent({ onCreated }: { onCreated?: () => void }) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        start_time: "",
        end_time: "",
        max_capacity: "",
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        setFormData({
            ...formData,
            [inputName]: inputValue,
        });
    };

    const handleSubmit = async () => {

        const { name, location, start_time, end_time, max_capacity } = formData;

        if (!name || !location || !start_time || !end_time || !max_capacity) {
            alert("All fields are required.");
            return;
        }

        if (new Date(start_time) <= new Date()) {
            alert("Start time must be in the future.");
        }


        if (new Date(start_time) >= new Date(end_time)) {
            alert("Start time must be before end time.");
            return;
        }

        if (Number(max_capacity) <= 0) {
            alert("Max capacity must be a positive number.");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                alert("Failed to save event");
                console.error("Failed to save event");
                return;
            }

            const data = await res.json();
            console.log("✅ Event created:", data);

            setOpen(false);
            setFormData({ name: "", location: "", start_time: "", end_time: "", max_capacity: "" });

            alert(data.message);

            if (onCreated) onCreated();
        } catch (err) {
            alert(err);
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger button */}
            <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Create Event
                </Button>
            </DialogTrigger>

            {/* Modal */}
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Event Name<span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Event Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                        <Input
                            id="location"
                            name="location"
                            placeholder="Event Location"
                            value={formData.location}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="start_time">Start Time <span className="text-red-500">*</span></Label>
                            <Input
                                type="datetime-local"
                                id="start_time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <Label htmlFor="end_time">End Time <span className="text-red-500">*</span></Label>
                            <Input
                                type="datetime-local"
                                id="end_time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="max_capacity">Max Capacity <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            id="max_capacity"
                            name="max_capacity"
                            placeholder="Max Capacity"
                            value={formData.max_capacity}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button className="bg-blue-600 text-white" onClick={handleSubmit}>
                        Save Event
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
