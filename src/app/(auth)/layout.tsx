import Image from "next/image";

export default async function AuthLayout  ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {    
  return (
    <main className="container pt-2 lg:pt-8">
      <Image src={`/img/logos/logo_spiqyp.png`} alt="Logo" width={200} height={200} className="lg:hidden mx-auto mt-10 mb-5 w-40" />
      <div className="flex justify-center">
        <div className="w-full max-w-md">
        
          {children}
        </div>
      </div>

      </main>
  );
}