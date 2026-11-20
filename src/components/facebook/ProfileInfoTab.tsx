"use client";

import React from "react";
import { Info, BookOpen, Music, Film, Briefcase, GraduationCap } from "lucide-react";

export function ProfileInfoTab() {
  return (
    <div className="bg-white border border-[#d8dfea] p-4 font-tahoma text-xs space-y-4">
      <div className="border-b border-[#3b5998] pb-1 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#3b5998] flex items-center gap-1.5">
          <Info className="w-4 h-4" /> Basic Information
        </h2>
        <span className="text-[11px] text-[#777]">Profile last updated: October 2008</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4 text-[11.5px]">
        <div className="text-[#777] font-bold">Networks:</div>
        <div className="md:col-span-2 text-[#3b5998] font-semibold">Harvard &apos;06, Silicon Valley</div>

        <div className="text-[#777] font-bold">Current City:</div>
        <div className="md:col-span-2 text-[#333]">Palo Alto, California</div>

        <div className="text-[#777] font-bold">Relationship Status:</div>
        <div className="md:col-span-2 text-[#333]">It&apos;s Complicated</div>

        <div className="text-[#777] font-bold">Birthday:</div>
        <div className="md:col-span-2 text-[#333]">May 14, 1984</div>

        <div className="text-[#777] font-bold">Hometown:</div>
        <div className="md:col-span-2 text-[#333]">Dobbs Ferry, New York</div>
      </div>

      <div className="border-b border-[#3b5998] pb-1 pt-3 flex items-center gap-1.5 text-sm font-bold text-[#3b5998]">
        <GraduationCap className="w-4 h-4" /> Education and Work
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4 text-[11.5px]">
        <div className="text-[#777] font-bold">College:</div>
        <div className="md:col-span-2 text-[#333]">Harvard University &apos;06, Computer Science &amp; Psychology</div>

        <div className="text-[#777] font-bold">High School:</div>
        <div className="md:col-span-2 text-[#333]">Phillips Exeter Academy &apos;02</div>

        <div className="text-[#777] font-bold">Employer:</div>
        <div className="md:col-span-2 text-[#333]">
          <span className="font-bold text-[#3b5998]">The Facebook</span> · Founder &amp; CEO (2004 - Present)
        </div>
      </div>

      <div className="border-b border-[#3b5998] pb-1 pt-3 flex items-center gap-1.5 text-sm font-bold text-[#3b5998]">
        <Music className="w-4 h-4" /> Interests &amp; Favorites
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-3 gap-x-4 text-[11.5px]">
        <div className="text-[#777] font-bold">Interests:</div>
        <div className="md:col-span-2 text-[#333]">Open source, wirearchy, revolution, making things, information flow, minimalism</div>

        <div className="text-[#777] font-bold">Favorite Music:</div>
        <div className="md:col-span-2 text-[#333]">Daft Punk, Green Day, Shakira, Beck, Jay-Z</div>

        <div className="text-[#777] font-bold">Favorite Movies:</div>
        <div className="md:col-span-2 text-[#333]">Gladiator, The Matrix, Star Wars</div>
      </div>
    </div>
  );
}
