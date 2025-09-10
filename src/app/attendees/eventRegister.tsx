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

interface EventRegisterProps {
    eventId: number;
    onCreated: () => void;
    availableSlots: number;
}

export default function EventRegister({ eventId, onCreated, availableSlots }: EventRegisterProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
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

        const { name, email } = formData;

        if (!name || !email) {
            alert("All fields are required.");
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/events/${eventId}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                console.error("Failed to save event");
                return;
            }

            const data = await res.json();
            console.log("✅ Event created:", data);

            setOpen(false);
            setFormData({ name: "", email: "" }); // reset form

            alert(data.message);

            if (onCreated) onCreated();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Trigger button */}
            <DialogTrigger asChild>
                <Button className="bg-blue-600 text-white hover:bg-blue-700" disabled={availableSlots === 0} >
                    Register
                </Button>
            </DialogTrigger>

            {/* Modal */}
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Event Registration</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Full Name<span className="text-red-500">*</span></Label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                        <Input
                            id="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
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