import { Skeleton } from "@nextui-org/react";
import { Swiper } from "swiper/react";

export default async function Loading({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {



    return (
        <main>
            <Skeleton className="w-full aspect-[3/1] aspect=[1/3]" />
            <div className="container mt-6">
                <div className="flex gap-2 text-black pt-8">

                {[1,2,3,4].map(i => (
                    <Skeleton key={i} className="w-full aspect-[0.75]" />
                ))}
                </div>
            </div>
        </main>
    );
}
