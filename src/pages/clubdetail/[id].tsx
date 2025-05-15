// pages/club/[id].tsx
import { useRouter } from 'next/router';
import LayoutShell from '@/comps/layouts/LayoutShell';
import Clubdetail from '@/comps/clubdetailpage/clubdetail';

function PageContent() {
    const { id } = useRouter().query;

    if (!id || typeof id !== 'string') return <div className="text-white p-10">Loading...</div>;
  

    return (
        <div className="bg-white w-full overflow-x-hidden h-full pt-14">
            <Clubdetail clubId={id} />
        </div>
        // <>
        //     {canRead && (
        //         <div className="fadeIn-animation">
        //             {/* <CheckIn /> */}
        //         </div>
        //     )}
        // </>
    );
}


export default function clubdetail() {
    return (
        <>
            <LayoutShell>
                <PageContent></PageContent>
            </LayoutShell>
        </>
    );
}