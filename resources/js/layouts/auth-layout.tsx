import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    children,
    title,
    description,
    className,
    ...props
}: {
    children: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description} className={className} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}
