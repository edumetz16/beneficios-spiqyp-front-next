import { Skeleton } from "@nextui-org/react";

export default async function Loading({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  

  return (
    <>
        <div className="container">
            <div className="flex gap-2 text-black pt-8">
                <p>{`Beneficios > `}</p>
            </div>
            <div className="flex flex-col lg:flex-row text-black mt-6 justify-between">
                <Skeleton className="w-48 h-8"/>
                <Skeleton className="w-24 h-4"/>
            </div>
            <div className="mt-6 grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                    <Skeleton className="w-full aspect-[2/1]"/>
                </div>
                {/* <div className="col-span-12 lg:col-span-6 text-black flex">
                    <div className="p-4 rounded-xl w-full lg:w-2/3 drop-shadow-md">
                        <p>{company.description}</p>
                        <p className="mt-4">{company.phone}</p>
                        <p>{company.email}</p>
                        <Link href={company.website}>{company.website}</Link>
                    </div>
                </div> */}
            </div>
            {/* <div className="grid grid-cols-12 mt-10">
                {
                    benefits.map((benefit:any, i:number) => (
                        <BenefitCard key={i}
                        benefit={benefit}
                        />
                    ))
                }
            </div> */}
        </div>
    </>
  );
}
