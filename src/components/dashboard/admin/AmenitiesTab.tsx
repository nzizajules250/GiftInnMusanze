"use client";

import { useState } from "react";
import type { Amenity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle } from "lucide-react";
import { ManageAmenityDialog } from "./ManageAmenityDialog";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { deleteAmenityAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { getIcon } from "@/lib/icons";

export function AmenitiesTab({ amenities }: { amenities: Amenity[] }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState<Amenity | null>(null);
    const [deletingAmenity, setDeletingAmenity] = useState<Amenity | null>(null);
    const { toast } = useToast();

    const handleEdit = (amenity: Amenity) => {
        setEditingAmenity(amenity);
        setDialogOpen(true);
    };

    const handleAddNew = () => {
        setEditingAmenity(null);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!deletingAmenity) return;
        const result = await deleteAmenityAction(deletingAmenity.id);
        if (result.success) {
            toast({ title: "Amenity Deleted", description: "The amenity has been successfully deleted." });
        } else {
            toast({ title: "Error", description: result.error, variant: "destructive" });
        }
        setDeletingAmenity(null);
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Manage Amenities</CardTitle>
                        <CardDescription>Add, edit, or remove hotel amenities.</CardDescription>
                    </div>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add New Amenity
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Icon</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {amenities.map((amenity) => {
                                const Icon = getIcon(amenity.icon);
                                return (
                                    <TableRow key={amenity.id}>
                                        <TableCell><Icon className="w-6 h-6" /></TableCell>
                                        <TableCell>{amenity.title}</TableCell>
                                        <TableCell className="hidden md:table-cell">{amenity.description}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(amenity)}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={() => setDeletingAmenity(amenity)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <ManageAmenityDialog
                isOpen={dialogOpen}
                setIsOpen={setDialogOpen}
                amenity={editingAmenity}
            />
            
            <DeleteConfirmationDialog
                isOpen={!!deletingAmenity}
                setIsOpen={() => setDeletingAmenity(null)}
                onConfirm={handleDelete}
                itemType="amenity"
            />
        </>
    );
}
