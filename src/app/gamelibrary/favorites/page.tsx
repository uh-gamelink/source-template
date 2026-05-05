import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import FavoritesClient from './FavoritesClient';

export const dynamic = 'force-dynamic';

const FavoritesPage = async () => {

    const session = await auth();

    if (!session || !session?.user?.email) {
        redirect('/auth/signin');
    }

    if (session?.user?.role === 'ADMIN') {
        redirect('/admin/manage');
    }
        
    return <FavoritesClient />;
};

export default FavoritesPage;