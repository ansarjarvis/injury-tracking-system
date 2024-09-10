"use client";
import InjuryReportList from "@/components/ReportList";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function Home() {
  let { user } = useUser();
  return (
    <div className="text-4xl relative z-20 md:text-7xl font-bold text-center text-black dark:text-white font-sans">
      <div className="gap-14 h-screen w-full flex flex-col justify-center items-center ">
        <div className="bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
          <span className="">
            Track. Recover. Excel: Your Ultimate Injury Management Companion
          </span>
        </div>
        {user ? (
          <Link
            href={"/injuryReport"}
            className={cn(
              buttonVariants(),
              "flex transform h-14 bg-white text-base text-black hover:ring-2 hover:ring-gray-200 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-shadow duration-300 hover:shadow-xl hover:bg-while-200 max-w-xs w-full "
            )}
          >
            Create Report <ArrowRight className="h-5 w-5 ml-1" />
          </Link>
        ) : (
          <Link
            href={"/api/auth/login"}
            className={cn(
              buttonVariants(),
              "flex transform h-14 bg-white text-base text-black hover:ring-2 hover:ring-gray-200 hover:ring-offset-2 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-shadow duration-300 hover:shadow-xl hover:bg-while-200 max-w-xs w-full "
            )}
          >
            Get Started <ArrowRight className="h-5 w-5 ml-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
