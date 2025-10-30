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
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import {
    BookOpen,
    Calendar,
    CheckCircle2,
    Edit,
    MoreVertical,
    Plus,
    Trash2,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import { type BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';

interface ClassSchedule {
    id: number;
    name: string;
    day: string;
    start_time: string;
    end_time: string;
    lecturer: string;
    room?: string;
    credits?: number;
}

interface Assignment {
    id: number;
    name: string;
    deadline: string;
    status: string;
    description?: string;
}

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

type AssignmentType = 'akademik' | 'non akademik';

interface Day {
    key: string;
    label: string;
}

interface PageProps extends Record<string, unknown> {
    classSchedules: ClassSchedule[];
    assignments: Assignment[];
    organizations: Organization[];
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Akademik',
        href: dashboard().url,
    },
];

export default function AcademicPage() {
    const { classSchedules, assignments, organizations } = usePage<PageProps>().props;

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

    // State for schedule
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [schDay, setSchDay] = useState('');
    const [schCourseName, setSchCourseName] = useState('');
    const [schLecturer, setSchLecturer] = useState('');
    const [schRoom, setSchRoom] = useState('');
    const [schStart, setSchStart] = useState('');
    const [schEnd, setSchEnd] = useState('');
    const [schCredits, setSchCredits] = useState(0);
    const [schError, setSchError] = useState('');
    const [savingSchedule, setSavingSchedule] = useState(false);

    // State for editing schedule
    const [editScheduleOpen, setEditScheduleOpen] = useState(false);
    const [editSchId, setEditSchId] = useState<number | null>(null);
    const [editSchDay, setEditSchDay] = useState('');
    const [editSchCourseName, setEditSchCourseName] = useState('');
    const [editSchLecturer, setEditSchLecturer] = useState('');
    const [editSchRoom, setEditSchRoom] = useState('');
    const [editSchStart, setEditSchStart] = useState('');
    const [editSchEnd, setEditSchEnd] = useState('');
    const [editSchCredits, setEditSchCredits] = useState(0);
    const [editSchError, setEditSchError] = useState('');
    const [savingEditSchedule, setSavingEditSchedule] = useState(false);

    // State for organization
    const [orgOpen, setOrgOpen] = useState(false);
    const [orgName, setOrgName] = useState('');
    const [orgPosition, setOrgPosition] = useState('');
    const [orgDescription, setOrgDescription] = useState('');
    const [orgError, setOrgError] = useState('');
    const [savingOrg, setSavingOrg] = useState(false);

    const days: Day[] = [
        { key: 'senin', label: 'Senin' },
        { key: 'selasa', label: 'Selasa' },
        { key: 'rabu', label: 'Rabu' },
        { key: 'kamis', label: 'Kamis' },
        { key: 'jumat', label: 'Jumat' },
        { key: 'sabtu', label: 'Sabtu' },
        { key: 'minggu', label: 'Minggu' },
    ];

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

    const handleAddSchedule = () => {
        if (!schDay || !schCourseName || !schLecturer || !schStart || !schEnd) {
            setSchError('Semua field wajib diisi');
            return;
        }
        setSavingSchedule(true);
        setSchError('');
        router.post('/schedule/store-class', {
            name: schCourseName,
            day: schDay,
            time: `${schStart}-${schEnd}`,
            lecturer: schLecturer,
            room: schRoom,
            credits: schCredits,
        }, {
            onSuccess: () => {
                setSchCourseName('');
                setSchDay('');
                setSchLecturer('');
                setSchRoom('');
                setSchStart('');
                setSchEnd('');
                setSchCredits(0);
                setScheduleOpen(false);
                setSavingSchedule(false);
            },
            onError: () => {
                setSchError('Terjadi kesalahan saat menambahkan jadwal');
                setSavingSchedule(false);
            },
        });
    };

    const openEditSchedule = (id: number) => {
        const schedule = classSchedules.find((s: ClassSchedule) => s.id === id);
        if (schedule) {
            setEditSchId(id);
            setEditSchDay(schedule.day);
            setEditSchCourseName(schedule.name);
            setEditSchLecturer(schedule.lecturer);
            setEditSchRoom(schedule.room || '');
            setEditSchStart(schedule.start_time);
            setEditSchEnd(schedule.end_time);
            setEditSchCredits(schedule.credits || 0);
            setEditScheduleOpen(true);
        }
    };

    const handleEditSchedule = () => {
        if (!editSchId || !editSchDay || !editSchCourseName || !editSchLecturer || !editSchStart || !editSchEnd) {
            setEditSchError('Semua field wajib diisi');
            return;
        }
        setSavingEditSchedule(true);
        setEditSchError('');
        router.patch(`/schedule/update-class/${editSchId}`, {
            name: editSchCourseName,
            day: editSchDay,
            time: `${editSchStart}-${editSchEnd}`,
            lecturer: editSchLecturer,
            room: editSchRoom,
            credits: editSchCredits,
        }, {
            onSuccess: () => {
                setEditScheduleOpen(false);
                setSavingEditSchedule(false);
            },
            onError: () => {
                setEditSchError('Terjadi kesalahan saat mengedit jadwal');
                setSavingEditSchedule(false);
            },
        });
    };

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



    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Selamat datang, {(usePage().props.auth as any).user.name}!</h1>
                    <p className="text-muted-foreground mt-2">
                        Kelola jadwal kuliah, tugas akademik, dan organisasi Anda dengan mudah di satu tempat.
                    </p>
                </div>


      <div className="grid gap-4 md:grid-cols-2">
        {/* Tugas Akademik */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Todo Akademik
              </CardTitle>
              <CardDescription>Kelola dan tambahkan todo kuliah Anda</CardDescription>
            </div>
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Todo
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada todo akademik</p>
            ) : (
              assignments.map((assignment: Assignment) => (
                  <div key={assignment.id} className="p-3 border rounded-lg">
                    <div className="mb-1 flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{assignment.name}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{assignment.description || "Tidak ada deskripsi"}</p>
                        <p className="text-xs text-muted-foreground">
                          Deadline: {new Date(assignment.deadline).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${assignment.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
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

        {/* Jadwal Kuliah */}
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Jadwal Kuliah
              </CardTitle>
              <CardDescription>Jadwal kuliah mingguan</CardDescription>
            </div>
            <Button size="sm" onClick={() => setScheduleOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Jadwal
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {days.map((day) => {
                const courses = classSchedules.filter((cls: ClassSchedule) => cls.day.toLowerCase() === day.key.toLowerCase());
                return courses.length > 0 ? (
                  <div
                    key={day.key}
                    className="rounded-lg border p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{day.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{courses.length} mata kuliah</span>
                    </div>
                    <div className="space-y-2">
                      {courses.map((course: ClassSchedule) => (
                        <div key={course.id} className="flex items-center justify-between rounded-md border p-3">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-medium">{course.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {course.lecturer}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {course.start_time} - {course.end_time}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditSchedule(course.id)}
                            aria-label="Edit schedule"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organisasi yang Diikuti */}
      <div className="grid gap-4">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Organisasi yang Diikuti
              </CardTitle>
            </div>
            <Button size="sm" onClick={() => setOrgOpen(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Organisasi
            </Button>
          </CardHeader>
          <CardContent>
            {organizations.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">Belum ada organisasi yang diikuti</p>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {organizations.map((org: Organization) => (
                  <div key={org.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{org.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{org.position}</p>
                    <p className="text-xs text-muted-foreground mt-1">{org.description}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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

      {/* Dialog: Tambah Jadwal Kuliah */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tambah Jadwal Kuliah</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="sch-day" className="text-sm font-medium">
                  Hari
                </label>
                <select
                  id="sch-day"
                  value={schDay}
                  onChange={(e) => setSchDay(e.target.value)}
                  required
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {days.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="sch-name" className="text-sm font-medium">
                  Mata Kuliah
                </label>
                <Input
                  id="sch-name"
                  placeholder="Contoh: RPL"
                  value={schCourseName}
                  onChange={(e) => setSchCourseName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="sch-lecturer" className="text-sm font-medium">
                  Dosen
                </label>
                <Input
                  id="sch-lecturer"
                  placeholder="Nama dosen"
                  value={schLecturer}
                  onChange={(e) => setSchLecturer(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="sch-room" className="text-sm font-medium">
                  Ruang
                </label>
                <Input
                  id="sch-room"
                  placeholder="Contoh: Gd A-203"
                  value={schRoom}
                  onChange={(e) => setSchRoom(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="sch-start" className="text-sm font-medium">
                  Mulai
                </label>
                <Input id="sch-start" type="time" value={schStart} onChange={(e) => setSchStart(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="sch-end" className="text-sm font-medium">
                  Selesai
                </label>
                <Input id="sch-end" type="time" value={schEnd} onChange={(e) => setSchEnd(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="sch-credits" className="text-sm font-medium">
                  SKS
                </label>
                <Input
                  id="sch-credits"
                  type="number"
                  min={0}
                  max={6}
                  value={schCredits}
                  onChange={(e) => setSchCredits(Number(e.target.value))}
                />
              </div>
            </div>

            {schError && <p className="text-sm text-red-600">{schError}</p>}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setScheduleOpen(false)}>Batal</Button>
            <Button onClick={handleAddSchedule} disabled={savingSchedule || !schDay || !schCourseName || !schLecturer || !schStart || !schEnd}>
              {savingSchedule ? "Menyimpan..." : "Tambah Jadwal"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Edit Jadwal Kuliah */}
      <Dialog open={editScheduleOpen} onOpenChange={setEditScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Jadwal Kuliah</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="edit-sch-day" className="text-sm font-medium">
                  Hari
                </label>
                <select
                  id="edit-sch-day"
                  value={editSchDay}
                  onChange={(e) => setEditSchDay(e.target.value)}
                  required
                  className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {days.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label htmlFor="edit-sch-name" className="text-sm font-medium">
                  Mata Kuliah
                </label>
                <Input
                  id="edit-sch-name"
                  placeholder="Contoh: RPL"
                  value={editSchCourseName}
                  onChange={(e) => setEditSchCourseName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="edit-sch-lecturer" className="text-sm font-medium">
                  Dosen
                </label>
                <Input
                  id="edit-sch-lecturer"
                  placeholder="Nama dosen"
                  value={editSchLecturer}
                  onChange={(e) => setEditSchLecturer(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="edit-sch-room" className="text-sm font-medium">
                  Ruang
                </label>
                <Input
                  id="edit-sch-room"
                  placeholder="Contoh: Gd A-203"
                  value={editSchRoom}
                  onChange={(e) => setEditSchRoom(e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label htmlFor="edit-sch-start" className="text-sm font-medium">
                  Mulai
                </label>
                <Input id="edit-sch-start" type="time" value={editSchStart} onChange={(e) => setEditSchStart(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="edit-sch-end" className="text-sm font-medium">
                  Selesai
                </label>
                <Input id="edit-sch-end" type="time" value={editSchEnd} onChange={(e) => setEditSchEnd(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="edit-sch-credits" className="text-sm font-medium">
                  SKS
                </label>
                <Input
                  id="edit-sch-credits"
                  type="number"
                  min={0}
                  max={6}
                  value={editSchCredits}
                  onChange={(e) => setEditSchCredits(Number(e.target.value))}
                />
              </div>
            </div>

            {editSchError && <p className="text-sm text-red-600">{editSchError}</p>}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditScheduleOpen(false)}>Batal</Button>
            <Button onClick={handleEditSchedule} disabled={savingEditSchedule || !editSchDay || !editSchCourseName || !editSchLecturer || !editSchStart || !editSchEnd}>
              {savingEditSchedule ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            </div>
        </AppLayout>
    )
}
