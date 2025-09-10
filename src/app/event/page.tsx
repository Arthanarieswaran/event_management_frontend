"use client";

import { Button } from "@/components/ui/button";
import Eventlist from "./eventList";
import CreateEvent from "./createEvent";
import { useState } from "react";

export default function Home() {

    const [refreshKey, setRefreshKey] = useState(0);
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="bg-blue-100 p-8 flex justify-between items-center rounded-xl shadow">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Welcome to EventFlow!</h1>
                    <p className="text-gray-700">Discover and manage your upcoming events with ease.</p>
                </div>
                {/* <Button className="bg-blue-600 text-white hover:bg-blue-700">Create Event</Button> */}
                <CreateEvent onCreated={() => setRefreshKey((k) => k + 1)} />
            </div>

            <Eventlist  refresh={refreshKey}></Eventlist>
        </div>
    )
}
