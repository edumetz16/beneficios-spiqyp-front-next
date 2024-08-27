
import Register from "../components/Register/Register";



export default async function SignInPage() {
  // if (await isUserAuthenticated()) redirect("/dashboard");
  
  return (
    
    <main className="container">
      
      <div className="flex justify-center">
        <div className="w-full lg:w-1/2">
          <Register></Register>
        </div>
      </div>
      
      
    </main>
  );
}