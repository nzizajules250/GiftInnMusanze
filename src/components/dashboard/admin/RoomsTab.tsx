
"use client";

import { useState } from "react";
import type { Room } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { ManageRoomDialog } from "./ManageRoomDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { deleteRoomAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function RoomsTab({ rooms }: { rooms: Room[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);
    const [deletingRoom, setDeletingRoom] = useState<Room | null>(null);
    const { toast } = useToast();

    const handleEdit = (room: Room) => {
        setEditingRoom(room);
        setDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingRoom(null);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingRoom) return;
        const result = await deleteRoomAction(deletingRoom.id);
        if (result.success) {
            toast({ title: "Room Deleted", description: "The room has been successfully deleted." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setDeletingRoom(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Manage Rooms</CardTitle>
                        <CardDescription>Add, edit, or remove hotel rooms.</CardDescription>
                    </div>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Room
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-24 hidden sm:table-cell">Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rooms.map((room) => (
                                <TableRow key={room.id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image 
                                            src={room.images?.[0]?.url || 'https://placehold.co/64x64.png'} 
                                            alt={room.name} 
                                            width={64} 
                                            height={64} 
                                            className="rounded-md object-cover"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{room.name}</div>
                                        <div className="text-sm text-muted-foreground line-clamp-2">{room.description}</div>
                                    </TableCell>
                                    <TableCell>${room.price}/night</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => handleEdit(room)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => setDeletingRoom(room)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ManageRoomDialog
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
                room={editingRoom}
            />
            
            <DeleteConfirmationDialog
                isOpen={!!deletingRoom}
                setIsOpen={() => setDeletingRoom(null)}
                onConfirm={handleDelete}
                itemType="room"
            />
        </>
    );
}
