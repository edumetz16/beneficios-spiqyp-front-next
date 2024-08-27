import { Company } from "@/services/companies/companies";
import { Image } from "@nextui-org/react";
import Link from "next/link";

interface CompanyCardProps{
    content: Company;
}

const CompanyCard = ({content}:CompanyCardProps) => {
    return (
        <>
        <Link href={`/benefits/${content.id ? content.id : content.objectId}`}>
        <div className="flex flex-col relative rounded-xl text-black border-2 border-gray-400 border-opacity-50 overflow-hidden min-h-[376px] shadow-lg">
            <Image className="min-h-[220px] max-h-[220px] object-cover w-full" src={content.companyImage} alt={"benefit-img"} width={380} height={257} />
            {content.companyLogo && <div className="absolute top-2 right-2 z-10 bg-white p-1 rounded-lg"><Image className="h-8" src={content.companyLogo} alt={content.name}/></div>}
            <div className="px-4 py-6 h-48">
                <h1 className="uppercase text-lg font-bold">{content.name}</h1>
                <p className="h-16 overflow-hidden text-sm">{content.description}</p>
            </div>
        </div>
        </Link>
        </>
    )
}

export default CompanyCard;