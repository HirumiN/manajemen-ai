import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { router } from '@inertiajs/react';
import {
    Edit,
    MoreVertical,
    Plus,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';

interface Organization {
    id: number;
    name: string;
    type?: string;
    position?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description: string;
}

interface OrganizationsSectionProps {
    organizations: Organization[];
}

export default function OrganizationsSection({ organizations }: OrganizationsSectionProps) {
    // State for organization
    const [orgOpen, setOrgOpen] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [orgPosition, setOrgPosition] = useState('');
    const [orgDescription, setOrgDescription] = useState('');
    const [orgError, setOrgError] = useState('');
    const [savingOrg, setSavingOrg] = useState(false);

    // State for editing organization
    const [editOrgOpen, setEditOrgOpen] = useState(false);
    const [editOrgId, setEditOrgId] = useState<number | null>(null);
    const [editOrgName, setEditOrgName] = useState('');
    const [editOrgPosition, setEditOrgPosition] = useState('');
    const [editOrgDescription, setEditOrgDescription] = useState('');
    const [editOrgError, setEditOrgError] = useState('');
    const [savingEditOrg, setSavingEditOrg] = useState(false);

    const handleAddOrg = () => {
        setSavingOrg(true);
        setOrgError('');
        router.post('/schedule/store-organization', {
            name: orgName,
            position: orgPosition,
            description: orgDescription,
        }, {
            onSuccess: () => {
                setOrgName('');
                setOrgPosition('');
                setOrgDescription('');
                setOrgOpen(false);
                setSavingOrg(false);
            },
            onError: () => {
                setOrgError('Terjadi kesalahan saat menambahkan organisasi');
                setSavingOrg(false);
            },
        });
    };

    const openEditOrg = (id: number) => {
        const org = organizations.find((o: Organization) => o.id === id);
        if (org) {
            setEditOrgId(id);
            setEditOrgName(org.name);
            setEditOrgPosition(org.position || '');
            setEditOrgDescription(org.description);
            setEditOrgOpen(true);
        }
    };

    const handleEditOrg = () => {
        if (!editOrgId) return;
        setSavingEditOrg(true);
        setEditOrgError('');
        router.patch(`/schedule/update-organization/${editOrgId}`, {
            name: editOrgName,
            position: editOrgPosition,
            description: editOrgDescription,
        }, {
            onSuccess: () => {
                setEditOrgOpen(false);
                setSavingEditOrg(false);
            },
            onError: () => {
                setEditOrgError('Terjadi kesalahan saat mengedit organisasi');
                setSavingEditOrg(false);
            },
        });
    };

    return (
        <>
            <div className="grid gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <Users className="h-8 w-8" />
                                Organisasi yang Diikuti
                            </CardTitle>
                        </div>
                        <Button size="lg" onClick={() => setOrgOpen(true)}>
                            <Plus className="h-5 w-5 mr-2" />
                            Organisasi
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {organizations.length === 0 ? (
                            <p className="text-muted-foreground text-center py-8 text-base font-bold">Belum ada organisasi yang diikuti</p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                {organizations.map((org: Organization) => (
                                    <div key={org.id} className="p-4 border rounded-lg bg-muted">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-bold text-lg">{org.name}</h4>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm" aria-label="More options">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditOrg(org.id)}>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => router.delete(`/schedule/destroy-organization/${org.id}`)}>
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Hapus
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                        <p className="text-lg text-muted-foreground">{org.position}</p>
                                        <p className="text-base text-muted-foreground mt-1">{org.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Dialog: Tambah Organisasi */}
            <Dialog open={orgOpen} onOpenChange={setOrgOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Tambah Organisasi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="org-name" className="text-sm font-medium">
                                    Nama Organisasi
                                </label>
                                <Input
                                    id="org-name"
                                    placeholder="Contoh: GDSC"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="org-position" className="text-sm font-medium">
                                    Jabatan
                                </label>
                                <Input
                                    id="org-position"
                                    placeholder="Contoh: Core Team"
                                    value={orgPosition}
                                    onChange={(e) => setOrgPosition(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="org-description" className="text-sm font-medium">
                                Deskripsi (opsional)
                            </label>
                            <Textarea
                                id="org-description"
                                placeholder="Deskripsi organisasi..."
                                value={orgDescription}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrgDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {orgError && <p className="text-sm text-red-600">{orgError}</p>}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setOrgOpen(false)}>Batal</Button>
                        <Button onClick={handleAddOrg} disabled={savingOrg}>
                            {savingOrg ? "Menyimpan..." : "Tambah Organisasi"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog: Edit Organisasi */}
            <Dialog open={editOrgOpen} onOpenChange={setEditOrgOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Organisasi</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="edit-org-name" className="text-sm font-medium">
                                    Nama Organisasi
                                </label>
                                <Input
                                    id="edit-org-name"
                                    placeholder="Contoh: GDSC"
                                    value={editOrgName}
                                    onChange={(e) => setEditOrgName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="edit-org-position" className="text-sm font-medium">
                                    Jabatan
                                </label>
                                <Input
                                    id="edit-org-position"
                                    placeholder="Contoh: Core Team"
                                    value={editOrgPosition}
                                    onChange={(e) => setEditOrgPosition(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="edit-org-description" className="text-sm font-medium">
                                Deskripsi (opsional)
                            </label>
                            <Textarea
                                id="edit-org-description"
                                placeholder="Deskripsi organisasi..."
                                value={editOrgDescription}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditOrgDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {editOrgError && <p className="text-sm text-red-600">{editOrgError}</p>}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setEditOrgOpen(false)}>Batal</Button>
                        <Button onClick={handleEditOrg} disabled={savingEditOrg || !editOrgId}>
                            {savingEditOrg ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
