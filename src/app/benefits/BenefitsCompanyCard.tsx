import React from "react";
import { useRouter } from "next/navigation";

interface BenefitsCompanyCardProps {
  company: {
    name: string;
    companyImage?: string;
    objectID: string;
  };
}

const BenefitsCompanyCard: React.FC<BenefitsCompanyCardProps> = ({ company }) => {
  const router = useRouter();
  return (
    <div
      className="bg-white rounded-2xl shadow overflow-hidden flex flex-col h-full border border-gray-100 cursor-pointer hover:shadow-lg transition"
      onClick={() => router.push(`/benefits/${company.objectID}`)}
    >
      {company.companyImage && (
        <div className="w-full h-full overflow-hidden">
          <img
            src={company.companyImage}
            alt={company.name}
            className="w-full h-32 min-w-full min-h-full object-cover object-center rounded-t-2xl"
          />
        </div>
      )}
      <div className="px-5 py-4 flex flex-col justify-center h-full">
        <span className="block font-bold text-lg text-gray-800 text-left">{company.name}</span>
      </div>
    </div>
  );
};

export default BenefitsCompanyCard; 