"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import EventRegister from "../attendees/eventRegister"

interface Event {
    id: number
    name: string
    location: string
    start_time: string
    end_time: string
    max_capacity: number
    created_at: string
    attendees_count: number
}

interface PaginationLink {
    url: string | null
    label: string
    page: number | null
    active: boolean
}

interface ApiResponse {
    success: boolean
    data: {
        current_page: number
        data: Event[]
        links: PaginationLink[]
        next_page_url: string | null
        prev_page_url: string | null
        total: number
    }
    message: string
}

export default function Eventlist({ refresh }: { refresh: number }) {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(false)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [total, setTotal] = useState(0)
    const [pagination, setPagination] = useState<PaginationLink[]>([])
    const router = useRouter();

    const [refreshKey, setRefreshKey] = useState(0);

    const fetchEvents = async (page = 1, search = "") => {
        setLoading(true)
        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/event?page=${page}&search=${search}`
            )
            const json: ApiResponse = await res.json()
            setEvents(json.data.data)
            setTotal(json.data.total)
            setPagination(json.data.links)
        } catch (err) {
            console.error("Error fetching events:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents(page, search)
    }, [page, search, refresh, refreshKey])

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPage(1)
        fetchEvents(1, search)
    }

    return (
        <main className="p-8">
            <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
            <Card>
                <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="font-semibold">Event Details</h3>
                            <p className="text-sm text-gray-500">
                                A comprehensive list of all upcoming events.
                            </p>
                        </div>
                        <form onSubmit={handleSearch}>
                            <Input
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-64"
                            />
                        </form>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Start Time</TableHead>
                                <TableHead>End Time</TableHead>
                                <TableHead>Max Capacity</TableHead>
                                <TableHead>Available Slots</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => {
                                const availableSlots = event.max_capacity - event.attendees_count;

                                return (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.name}</TableCell>
                                        <TableCell>{event.location}</TableCell>
                                        <TableCell>{event.start_time}</TableCell>
                                        <TableCell>{event.end_time}</TableCell>
                                        <TableCell>{event.max_capacity}</TableCell>
                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded-full text-white text-sm ${availableSlots === 0 ? 'bg-red-500' : 'bg-green-500'
                                                    }`}
                                            >
                                                {availableSlots != 0 ? availableSlots + ' available' : 'Full'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="flex space-x-2">
                                            <Button variant="outline" onClick={() => router.push(`/attendees?id=${event.id}`)}>View Attendees</Button>
                                            <EventRegister eventId={event.id} availableSlots={availableSlots} onCreated={() => setRefreshKey((k) => k + 1)}></EventRegister>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
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
    )
}
