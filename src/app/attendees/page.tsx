"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Attendee {
    id: number;
    event_id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    page: number | null;
    active: boolean;
}

interface EventData {
    current_page: number;
    data: Attendee[];
    links: PaginationLink[];
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
    per_page: number;
}

interface ApiResponse {
    success: boolean;
    data: {
        event_name: string;
        event: EventData;
    };
    message: string;
}

export default function AttendeesPage() {
    const searchParams = useSearchParams();
    const eventId = searchParams.get("id");

    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [eventName, setEventName] = useState("");
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);
    const [pagination, setPagination] = useState<PaginationLink[]>([]);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);

    const fetchAttendees = async (page = 1, search = "") => {
        if (!eventId) return;
        setLoading(true);
        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/events/${eventId}/attendees?page=${page}&search=${search}`
            );
            const json: ApiResponse = await res.json();

            // Safely set state
            setAttendees(json.data.event?.data || []);
            setEventName(json.data.event_name || "");
            setTotal(json.data.event?.total || 0);
            setPagination(json.data.event?.links || []);
            setNextPageUrl(json.data.event?.next_page_url || null);
            setPrevPageUrl(json.data.event?.prev_page_url || null);
        } catch (err) {
            console.error("Error fetching attendees:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendees(page, search);
    }, [page, search, eventId]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
        fetchAttendees(1, search);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="bg-blue-100 p-8 flex justify-between items-center rounded-xl shadow">
                <div>
                    <h1 className="text-2xl font-bold mb-2">
                        Attendees for '{eventName}'
                    </h1>
                </div>
            </div>

            <main className="p-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="font-semibold">Event Details</h3>
                                <p className="text-sm text-gray-500">
                                    A complete list of attendees.
                                </p>
                            </div>

                            <form onSubmit={handleSearch}>
                                <Input
                                    type="text"
                                    placeholder="Search attendees..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64"
                                />
                            </form>
                        </div>

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>S.No</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Registration Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {/* {attendees.length > 0 ? () : ()} */}
                                {attendees.length > 0 ? (
                                    attendees.map((attendee, index) => (
                                        <TableRow key={attendee.id}>
                                            <TableCell className="font-medium">{index + 1}</TableCell>
                                            <TableCell className="font-medium">{attendee.name}</TableCell>
                                            <TableCell>{attendee.email}</TableCell>
                                            <TableCell>{attendee.created_at}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-gray-500">
                                            No data found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="flex justify-center items-center space-x-4 mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous
                            </Button>
                            <span className="px-2">{page}</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(page + 1)}
                            >
                                Next <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
