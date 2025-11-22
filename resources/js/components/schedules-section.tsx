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
import { router } from '@inertiajs/react';
import {
    Calendar,
    Edit,
    MoreVertical,
    Plus,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface ClassSchedule {
    id: number;
    name: string;
    day: string;
    start_time: string;
    end_time: string;
    lecturer: string;
    room?: string;
    credits?: number;
    semester_id: number;
}

interface Semester {
    id: number;
    number: number;
}

interface Day {
    key: string;
    label: string;
}

interface SchedulesSectionProps {
    classSchedules: ClassSchedule[];
    semesters: Semester[];
    currentSemester: Semester | null;
}

export default function SchedulesSection({ classSchedules, semesters, currentSemester }: SchedulesSectionProps) {
    // State for schedule
    const [scheduleOpen, setScheduleOpen] = useState(false);
    const [schDay, setSchDay] = useState('');
    const [schCourseName, setSchCourseName] = useState('');
    const [schLecturer, setSchLecturer] = useState('');
    const [schRoom, setSchRoom] = useState('');
    const [schStart, setSchStart] = useState('');
    const [schEnd, setSchEnd] = useState('');
    const [schCredits, setSchCredits] = useState(0);
    const [schSemester, setSchSemester] = useState(currentSemester?.id || '');
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
    const [editSchSemester, setEditSchSemester] = useState('');
    const [editSchError, setEditSchError] = useState('');
    const [savingEditSchedule, setSavingEditSchedule] = useState(false);

    const days: Day[] = [
        { key: 'senin', label: 'Senin' },
        { key: 'selasa', label: 'Selasa' },
        { key: 'rabu', label: 'Rabu' },
        { key: 'kamis', label: 'Kamis' },
        { key: 'jumat', label: 'Jumat' },
        { key: 'sabtu', label: 'Sabtu' },
        { key: 'minggu', label: 'Minggu' },
    ];

    const handleAddSchedule = () => {
        if (!schDay || !schCourseName || !schLecturer || !schStart || !schEnd || !schSemester) {
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
            credits: schCredits.toString(),
            semester_id: schSemester.toString(),
        }, {
            onSuccess: () => {
                setSchCourseName('');
                setSchDay('');
                setSchLecturer('');
                setSchRoom('');
                setSchStart('');
                setSchEnd('');
                setSchCredits(0);
                setSchSemester(currentSemester?.id || '');
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
            setEditSchSemester(schedule.semester_id.toString());
            setEditScheduleOpen(true);
        }
    };

    const handleEditSchedule = () => {
        if (!editSchId || !editSchDay || !editSchCourseName || !editSchLecturer || !editSchStart || !editSchEnd || !editSchSemester) {
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
            credits: editSchCredits.toString(),
            semester_id: editSchSemester.toString(),
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

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-start justify-between gap-2">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl font-bold">
                            <Calendar className="h-8 w-8" />
                            Jadwal Kuliah
                        </CardTitle>
                        <CardDescription className="text-lg">Jadwal kuliah mingguan</CardDescription>
                    </div>
                    <Button size="lg" onClick={() => setScheduleOpen(true)}>
                        <Plus className="h-5 w-5 mr-2" />
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
                                    className="rounded-lg border p-4 bg-muted"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-5 w-5" />
                                            <span className="font-bold text-lg">{day.label}</span>
                                        </div>
                                        <span className="text-base text-muted-foreground font-bold">{courses.length} mata kuliah</span>
                                    </div>
                                    <div className="space-y-2">
                                        {courses.map((course: ClassSchedule) => (
                                            <div key={course.id} className="flex items-center justify-between rounded-md border p-4 bg-background">
                                                <div className="flex items-center gap-3">
                                                    <div>
                                                        <h4 className="font-bold text-lg">{course.name}</h4>
                                                        <p className="text-lg text-muted-foreground">
                                                            {course.lecturer}
                                                        </p>
                                                        <p className="text-base text-muted-foreground">
                                                            {course.start_time} - {course.end_time}
                                                        </p>
                                                    </div>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" aria-label="More options">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem onClick={() => openEditSchedule(course.id)}>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => router.delete(`/schedule/destroy-class/${course.id}`)}>
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : null;
                        })}
                    </div>
                </CardContent>
            </Card>

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

                        <div className="space-y-1.5">
                            <label htmlFor="sch-semester" className="text-sm font-medium">
                                Semester
                            </label>
                            <select
                                id="sch-semester"
                                value={schSemester}
                                onChange={(e) => setSchSemester(e.target.value)}
                                required
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {semesters.map((sem) => (
                                    <option key={sem.id} value={sem.id}>
                                        Semester {sem.number}
                                    </option>
                                ))}
                            </select>
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

                        <div className="space-y-1.5">
                            <label htmlFor="edit-sch-semester" className="text-sm font-medium">
                                Semester
                            </label>
                            <select
                                id="edit-sch-semester"
                                value={editSchSemester}
                                onChange={(e) => setEditSchSemester(e.target.value)}
                                required
                                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                                {semesters.map((sem) => (
                                    <option key={sem.id} value={sem.id}>
                                        Semester {sem.number}
                                    </option>
                                ))}
                            </select>
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
        </>
    );
}
