import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Calendar,
    CheckCircle2,
    Clock,
    Plus,
    Trash2,
    User,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { schedule } from '@/routes';


interface ClassSchedule {
    id: number;
    name: string;
    day: string;
    time: string;
    lecturer: string;
}

interface Assignment {
    id: number;
    name: string;
    deadline: string;
    status: string;
}

interface Organization {
    id: number;
    name: string;
    description: string;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Akademik',
        href: schedule().url,
    },
];

export default function AcademicPage() {
    const { classSchedules, assignments, organizations } = usePage()
        .props as any;
    const [activeTab, setActiveTab] = useState('weekly');
    const [showAddClassDialog, setShowAddClassDialog] = useState(false);
    const [showAddAssignmentDialog, setShowAddAssignmentDialog] =
        useState(false);
    const [showAddOrgDialog, setShowAddOrgDialog] = useState(false);

    const [newClass, setNewClass] = useState({
        name: '',
        lecturer: '',
        time: '',
        day: '',
    });

    const [newAssignment, setNewAssignment] = useState({
        name: '',
        deadline: '',
        status: 'pending',
    });

    const [newOrganization, setNewOrganization] = useState({
        name: '',
        description: '',
    });

    const days = [
        'senin',
        'selasa',
        'rabu',
        'kamis',
        'jumat',
        'sabtu',
        'minggu',
    ];

    const handleAddClass = () => {
        router.post('/schedule/store-class', newClass, {
            onSuccess: () => {
                setNewClass({ name: '', lecturer: '', time: '', day: '' });
                setShowAddClassDialog(false);
            },
        });
    };

    const handleAddAssignment = () => {
        router.post('/schedule/store-assignment', newAssignment, {
            onSuccess: () => {
                setNewAssignment({ name: '', deadline: '', status: 'pending' });
                setShowAddAssignmentDialog(false);
            },
        });
    };

    const handleAddOrganization = () => {
        router.post('/schedule/store-organization', newOrganization, {
            onSuccess: () => {
                setNewOrganization({ name: '', description: '' });
                setShowAddOrgDialog(false);
            },
        });
    };

    const deleteClass = (id: number) => {
        router.delete(`/schedule/destroy-class/${id}`);
    };

    const deleteAssignment = (id: number) => {
        router.delete(`/schedule/destroy-assignment/${id}`);
    };

    const deleteOrganization = (id: number) => {
        router.delete(`/schedule/destroy-organization/${id}`);
    };

    const toggleAssignmentStatus = (id: number) => {
        router.patch(`/schedule/toggle-assignment/${id}`);
    };

    const getClassesByDay = (day: string) => {
        return classSchedules.filter(
            (cls: ClassSchedule) => cls.day.toLowerCase() === day.toLowerCase(),
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in-progress':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getDaysUntilDue = (dueDate: string) => {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Akademik" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Akademik</h1>
                        <p className="text-muted-foreground">
                            Kelola jadwal kuliah, tugas, dan organisasi yang
                            diikuti
                        </p>
                    </div>
                </div>

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="weekly">
                            Jadwal Mingguan
                        </TabsTrigger>
                        <TabsTrigger value="assignments">
                            Tugas & Deadline
                        </TabsTrigger>
                        <TabsTrigger value="organizations">
                            Organisasi yang Diikuti
                        </TabsTrigger>
                    </TabsList>

                    {/* Weekly Schedule Tab */}
                    <TabsContent value="weekly" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Jadwal Kuliah Mingguan
                            </h2>
                            <Dialog
                                open={showAddClassDialog}
                                onOpenChange={setShowAddClassDialog}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Kelas
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Tambah Kelas Baru
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Mata Kuliah</Label>
                                            <Input
                                                value={newClass.name}
                                                onChange={(e) =>
                                                    setNewClass({
                                                        ...newClass,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Nama mata kuliah"
                                            />
                                        </div>
                                        <div>
                                            <Label>Dosen</Label>
                                            <Input
                                                value={newClass.lecturer}
                                                onChange={(e) =>
                                                    setNewClass({
                                                        ...newClass,
                                                        lecturer:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Nama dosen"
                                            />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <Label>Waktu</Label>
                                                <Input
                                                    value={newClass.time}
                                                    onChange={(e) =>
                                                        setNewClass({
                                                            ...newClass,
                                                            time: e.target
                                                                .value,
                                                        })
                                                    }
                                                    placeholder="08:00 - 10:00"
                                                />
                                            </div>
                                            <div>
                                                <Label>Hari</Label>
                                                <Select
                                                    value={newClass.day}
                                                    onValueChange={(value) =>
                                                        setNewClass({
                                                            ...newClass,
                                                            day: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Pilih hari" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {days.map((day) => (
                                                            <SelectItem
                                                                key={day}
                                                                value={day}
                                                            >
                                                                {day
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    day.slice(
                                                                        1,
                                                                    )}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleAddClass}
                                            className="w-full"
                                        >
                                            Tambah Kelas
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid gap-4">
                            {days.map((day) => {
                                const dayClasses = getClassesByDay(day);
                                return (
                                    <Card key={day}>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2">
                                                <Calendar className="h-5 w-5" />
                                                {day.charAt(0).toUpperCase() +
                                                    day.slice(1)}
                                                <Badge variant="outline">
                                                    {dayClasses.length} kelas
                                                </Badge>
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {dayClasses.length === 0 ? (
                                                <p className="py-4 text-center text-muted-foreground">
                                                    Tidak ada kelas hari ini
                                                </p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {dayClasses.map(
                                                        (
                                                            cls: ClassSchedule,
                                                        ) => (
                                                            <div
                                                                key={cls.id}
                                                                className="flex items-center justify-between rounded-lg border p-3"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div>
                                                                        <h4 className="font-semibold">
                                                                            {
                                                                                cls.name
                                                                            }
                                                                        </h4>
                                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                            <span className="flex items-center gap-1">
                                                                                <User className="h-3 w-3" />
                                                                                {
                                                                                    cls.lecturer
                                                                                }
                                                                            </span>
                                                                            <span className="flex items-center gap-1">
                                                                                <Clock className="h-3 w-3" />
                                                                                {
                                                                                    cls.time
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        deleteClass(
                                                                            cls.id,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </TabsContent>

                    {/* Assignments Tab */}
                    <TabsContent value="assignments" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Tugas & Deadline
                            </h2>
                            <Dialog
                                open={showAddAssignmentDialog}
                                onOpenChange={setShowAddAssignmentDialog}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Tugas
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Tambah Tugas Baru
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Judul Tugas</Label>
                                            <Input
                                                value={newAssignment.name}
                                                onChange={(e) =>
                                                    setNewAssignment({
                                                        ...newAssignment,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Judul tugas"
                                            />
                                        </div>
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div>
                                                <Label>Deadline</Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        newAssignment.deadline
                                                    }
                                                    onChange={(e) =>
                                                        setNewAssignment({
                                                            ...newAssignment,
                                                            deadline:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label>Status</Label>
                                                <Select
                                                    value={newAssignment.status}
                                                    onValueChange={(value) =>
                                                        setNewAssignment({
                                                            ...newAssignment,
                                                            status: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">
                                                            Pending
                                                        </SelectItem>
                                                        <SelectItem value="in-progress">
                                                            In Progress
                                                        </SelectItem>
                                                        <SelectItem value="completed">
                                                            Completed
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleAddAssignment}
                                            className="w-full"
                                        >
                                            Tambah Tugas
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="space-y-4">
                            {assignments.map((assignment: Assignment) => {
                                const daysUntilDue = getDaysUntilDue(
                                    assignment.deadline,
                                );
                                const isOverdue = daysUntilDue < 0;

                                return (
                                    <Card
                                        key={assignment.id}
                                        className={
                                            isOverdue
                                                ? 'border-red-200 bg-red-50'
                                                : ''
                                        }
                                    >
                                        <CardContent className="pt-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex flex-1 items-start gap-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            toggleAssignmentStatus(
                                                                assignment.id,
                                                            )
                                                        }
                                                        className="mt-1"
                                                    >
                                                        {assignment.status ===
                                                        'completed' ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                                        ) : assignment.status ===
                                                          'in-progress' ? (
                                                            <Clock className="h-5 w-5 text-blue-600" />
                                                        ) : (
                                                            <AlertCircle className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </Button>
                                                    <div className="flex-1">
                                                        <div className="mb-2 flex items-center gap-2">
                                                            <h3
                                                                className={`font-semibold ${assignment.status === 'completed' ? 'text-muted-foreground line-through' : ''}`}
                                                            >
                                                                {
                                                                    assignment.name
                                                                }
                                                            </h3>
                                                            <Badge
                                                                className={getStatusColor(
                                                                    assignment.status,
                                                                )}
                                                                variant="outline"
                                                            >
                                                                {assignment.status ===
                                                                'completed'
                                                                    ? 'Selesai'
                                                                    : assignment.status ===
                                                                        'in-progress'
                                                                      ? 'Dikerjakan'
                                                                      : 'Pending'}
                                                            </Badge>
                                                        </div>
                                                        <div className="mb-2 flex items-center gap-4 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <Calendar className="h-3 w-3" />
                                                                {formatDate(
                                                                    assignment.deadline,
                                                                )}
                                                            </span>
                                                            {isOverdue && (
                                                                <Badge
                                                                    variant="destructive"
                                                                    className="text-xs"
                                                                >
                                                                    Terlambat{' '}
                                                                    {Math.abs(
                                                                        daysUntilDue,
                                                                    )}{' '}
                                                                    hari
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        deleteAssignment(
                                                            assignment.id,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>

                        {assignments.length === 0 && (
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="py-8 text-center">
                                        <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                        <p className="text-lg font-medium">
                                            Belum ada tugas
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Tambah tugas baru untuk mulai
                                            mengelola deadline Anda
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </TabsContent>

                    {/* Organizations Tab */}
                    <TabsContent value="organizations" className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold">
                                Organisasi yang Diikuti
                            </h2>
                            <Dialog
                                open={showAddOrgDialog}
                                onOpenChange={setShowAddOrgDialog}
                            >
                                <DialogTrigger asChild>
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Tambah Organisasi
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Tambah Organisasi
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Nama Organisasi</Label>
                                            <Input
                                                value={newOrganization.name}
                                                onChange={(e) =>
                                                    setNewOrganization({
                                                        ...newOrganization,
                                                        name: e.target.value,
                                                    })
                                                }
                                                placeholder="Nama organisasi"
                                            />
                                        </div>
                                        <div>
                                            <Label>Deskripsi</Label>
                                            <Textarea
                                                value={
                                                    newOrganization.description
                                                }
                                                onChange={(e) =>
                                                    setNewOrganization({
                                                        ...newOrganization,
                                                        description:
                                                            e.target.value,
                                                    })
                                                }
                                                placeholder="Deskripsi organisasi"
                                                rows={3}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleAddOrganization}
                                            className="w-full"
                                        >
                                            Tambah Organisasi
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Organizations List */}
                        <div className="space-y-4">
                            {organizations.length === 0 ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                        <h3 className="mb-2 text-lg font-semibold">
                                            Belum ada organisasi
                                        </h3>
                                        <p className="mb-4 text-muted-foreground">
                                            Mulai tambahkan organisasi dan
                                            kegiatan ekstrakurikuler yang pernah
                                            Anda ikuti
                                        </p>
                                        <Button
                                            onClick={() =>
                                                setShowAddOrgDialog(true)
                                            }
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Tambah Organisasi Pertama
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid gap-4">
                                    {organizations.map((org: Organization) => (
                                        <Card key={org.id}>
                                            <CardHeader>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <CardTitle className="flex items-center gap-2">
                                                            <Users className="h-5 w-5" />
                                                            {org.name}
                                                        </CardTitle>
                                                    </div>
                                                    <Button
                                                        onClick={() =>
                                                            deleteOrganization(
                                                                org.id,
                                                            )
                                                        }
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    {org.description && (
                                                        <p className="text-sm text-gray-700">
                                                            {org.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
