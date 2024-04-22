import PageButtons from "@/components/home-page";
import { getSession } from "@/helper/getSession";

export default async function Home() {
  const session = await getSession();
  return (
    <>
      <div className="h-screen w-screen flex items-center justify-center px-2">
        <div className="flex flex-col items-center">
          <p className="sm:text-7xl text-5xl font-bold leading-tight text-center sm:leading-tight lg:leading-tight">
            <span className="relative inline-flex sm:inline">
              <span className="bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] blur-lg filter opacity-30 w-full h-full absolute inset-0"></span>
              <span className="relative">{process.env.APP_NAME}</span>
            </span>
          </p>
          <p className="mb-4 text-gray-400 text-center mt-4 text-md md:text-xl max-w-2xl font-medium">
            This app will generate invoices for you, modify them and save them and send them.
          </p>
          <PageButtons data={session?.user} />
        </div>
      </div>
    </>
  );
}
