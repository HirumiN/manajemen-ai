import { Badge } from '@/components/ui/badge';
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
    BookOpen,
    CheckCircle2,
    Edit,
    MoreVertical,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Assignment {
    id: number;
    name: string;
    deadline: string;
    status: string;
    description?: string;
}

type AssignmentType = 'akademik' | 'non akademik';

interface AssignmentsSectionProps {
    assignments?: Assignment[];
}

export default function AssignmentsSection({ assignments = [] }: AssignmentsSectionProps) {
    // State for assignments
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [type, setType] = useState<AssignmentType>('akademik');
    const [dueDate, setDueDate] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // State for editing assignment
    const [editTitle, setEditTitle] = useState('');
    const [editType, setEditType] = useState<AssignmentType>('akademik');
    const [editDueDate, setEditDueDate] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const handleAddAssignment = () => {
        setSubmitting(true);
        setError('');
        router.post('/schedule/store-assignment', {
            name: title,
            deadline: dueDate,
            status: 'pending',
            description: description,
        }, {
            onSuccess: () => {
                setTitle('');
                setType('akademik');
                setDueDate('');
                setDescription('');
                setCreateOpen(false);
                setSubmitting(false);
            },
            onError: () => {
                setError('Terjadi kesalahan saat menambahkan todo');
                setSubmitting(false);
            },
        });
    };

    const openEdit = (id: number) => {
        const assignment = assignments.find((a: Assignment) => a.id === id);
        if (assignment) {
            setEditId(id);
            setEditTitle(assignment.name);
            setEditType('akademik');
            setEditDueDate(assignment.deadline);
            setEditDescription(assignment.description || '');
            setEditOpen(true);
        }
    };

    const saveEdit = () => {
        if (!editId) return;
        setSavingEdit(true);
        router.patch(`/schedule/update-assignment/${editId}`, {
            name: editTitle,
            deadline: editDueDate,
            status: 'pending',
            description: editDescription,
        }, {
            onSuccess: () => {
                setEditOpen(false);
                setSavingEdit(false);
            },
            onError: () => {
                setSavingEdit(false);
            },
        });
    };

    const markDone = (id: number) => {
        router.patch(`/schedule/update-assignment/${id}`, {
            status: 'done',
        });
    };

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl font-bold">
                            <BookOpen className="h-8 w-8" />
                            Todo Akademik
                        </CardTitle>
                        <CardDescription className="text-lg">Kelola dan tambahkan todo kuliah Anda</CardDescription>
                    </div>
                    <Button size="lg" onClick={() => setCreateOpen(true)}>
                        <Plus className="h-5 w-5 mr-2" />
                        Todo
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    {assignments.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8 text-base font-bold">Belum ada todo akademik</p>
                    ) : (
                        assignments.map((assignment: Assignment) => (
                            <div key={assignment.id} className="p-4 border rounded-lg bg-muted">
                                <div className="mb-1 flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg">{assignment.name}</h4>
                                        <p className="text-base text-muted-foreground mb-1">{assignment.description || "Tidak ada deskripsi"}</p>
                                        <p className="text-base text-muted-foreground">
                                            Deadline: {new Date(assignment.deadline).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded text-sm font-bold ${assignment.status === 'done' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                            {assignment.status === 'done' ? 'Selesai' : 'Belum'}
                                        </span>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" aria-label="More options">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => openEdit(assignment.id)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => markDone(assignment.id)}>
                                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                                    Selesai
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => router.delete(`/schedule/destroy-assignment/${assignment.id}`)}>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Hapus
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            {/* Dialog: Tambah Tugas */}
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Tambah Todo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="title" className="text-sm font-medium">
                                    Nama Todo
                                </label>
                                <Input
                                    id="title"
                                    placeholder="Contoh: Presentasi Desain"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="type" className="text-sm font-medium">
                                    Jenis Todo
                                </label>
                                <select
                                    id="type"
                                    value={type}
                                    onChange={(e) => setType(e.target.value as AssignmentType)}
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="akademik">Akademik</option>
                                    <option value="non akademik">Non Akademik</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="dueDate" className="text-sm font-medium">
                                    Deadline
                                </label>
                                <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="description" className="text-sm font-medium">
                                Deskripsi Todo (opsional)
                            </label>
                            <Textarea
                                id="description"
                                placeholder="Detail singkat todo..."
                                value={description}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                rows={3}
                            />
                        </div>

                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setCreateOpen(false)}>Batal</Button>
                        <Button onClick={handleAddAssignment} disabled={submitting}>
                            {submitting ? "Menambahkan..." : "Tambah Todo"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog: Edit Tugas */}
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="edit-title" className="text-sm font-medium">
                                    Judul Todo
                                </label>
                                <Input
                                    id="edit-title"
                                    placeholder="Judul todo"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label htmlFor="edit-type" className="text-sm font-medium">
                                    Jenis Todo
                                </label>
                                <select
                                    id="edit-type"
                                    value={editType}
                                    onChange={(e) => setEditType(e.target.value as AssignmentType)}
                                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <option value="akademik">Akademik</option>
                                    <option value="non akademik">Non Akademik</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="edit-due" className="text-sm font-medium">
                                    Deadline
                                </label>
                                <Input id="edit-due" type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="edit-desc" className="text-sm font-medium">
                                Deskripsi Todo (opsional)
                            </label>
                            <Textarea
                                id="edit-desc"
                                placeholder="Detail singkat todo..."
                                value={editDescription}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
                        <Button onClick={saveEdit} disabled={savingEdit || !editId}>
                            {savingEdit ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
