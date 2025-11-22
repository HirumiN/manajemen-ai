import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { schedule } from '@/routes';
import AssignmentsSection from '@/components/assignments-section';
import OrganizationsSection from '@/components/organizations-section';
import SchedulesSection from '@/components/schedules-section';

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

interface PageProps extends Record<string, unknown> {
    classSchedules: ClassSchedule[];
    assignments: Assignment[];
    organizations: Organization[];
    semesters: Semester[];
    currentSemester: Semester | null;
    auth: {
        user: {
            name: string;
        };
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Akademik', href: schedule().url },
];

export default function Schedule(props: PageProps) {

    const { classSchedules, assignments, organizations, semesters, currentSemester } = props;
    const user = usePage<PageProps>().props.auth.user;

    const handleSemesterChange = (value: string) => {
        const selected = parseInt(value, 10);

        // Prevent reloading if same semester selected
        if (selected === currentSemester?.id) return;

        router.get('/schedule', { semester: selected }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Schedule" />

            <div className="flex flex-1 flex-col p-4">
                
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-5xl font-bold tracking-tight">
                        Selamat datang, {user.name}!
                    </h1>
                    <p className="text-xl text-muted-foreground mt-2">
                        Kelola jadwal kuliah, tugas akademik, dan organisasi Anda dengan mudah di satu tempat.
                    </p>
                </div>

                {/* Semester Selector */}
                <div className="mb-6">
                    <label htmlFor="semester-select" className="text-sm font-medium">
                        Pilih Semester
                    </label>

                    <select
                        id="semester-select"
                        value={currentSemester?.id?.toString() ?? ''}
                        onChange={(e) => handleSemesterChange(e.target.value)}
                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="" disabled>
                            — Pilih Semester —
                        </option>

                        {semesters.map((sem) => (
                            <option key={sem.id} value={sem.id}>
                                Semester {sem.number}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sections */}
                <div className="grid gap-6 md:grid-cols-2">
                    <AssignmentsSection assignments={assignments} />
                    <SchedulesSection 
                        classSchedules={classSchedules}
                        semesters={semesters}
                        currentSemester={currentSemester}
                    />
                </div>

                <div className="grid gap-4 mt-6">
                    <OrganizationsSection organizations={organizations} />
                </div>

            </div>
        </AppLayout>
    );
}
