"use client";
import { NumberFormatter } from "@/utils/NumberFormatter";
import Image from "next/image";
import { useEffect, useState } from "react";

type SocialCardItem = {
  title: "Instagram" | "TikTok" | "YouTube";
  quantity: number | null;
  index: number;
  image: string;
  selectedSocialMedia: "Instagram" | "TikTok" | "YouTube";
  setSelectedSocialMedia: (item: "Instagram" | "TikTok" | "YouTube") => void;
};

export function SocialCard({
  title,
  quantity,
  index,
  image,
  selectedSocialMedia,
  // setSelectedSocialMedia,
}: SocialCardItem) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, index * 150);

    return () => clearTimeout(timeoutId);
  }, [index]);

  return (
    <button
      // onClick={() => setSelectedSocialMedia(title)}
      className={`relative mb-4 flex h-20 w-60 transform flex-row items-center justify-between overflow-hidden rounded-lg shadow-md transition-all duration-500 ease-out md:mb-0 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"} ${
        selectedSocialMedia === title
          ? "border border-[#FF0080]"
          : "border border-transparent"
      } `}
    >
      <div
        className={`absolute z-10 h-[110%] w-full transition-all duration-300 ${
          selectedSocialMedia === title ? "bg-white" : "bg-white/80"
        } `}
      />
      <div
        className={`absolute z-20 h-[110%] w-full transition-all duration-300 ${
          selectedSocialMedia === title ? "opacity-0" : "bg-black/20 opacity-60"
        } `}
      />
      <div className="z-30 flex h-full w-full flex-row items-center justify-between p-4">
        <div className="mr-4 flex flex-col gap-2">
          <span className="text-sm font-semibold text-[#67748E] xl:text-lg">
            {title}
          </span>
          <span className="text-start text-xl font-bold text-[#252F40]">
            {quantity && NumberFormatter(quantity)}
          </span>
        </div>
        <Image
          src={image}
          alt=""
          width={56}
          height={56}
          className="h-8 w-auto object-contain md:h-10 md:w-auto lg:h-12 lg:w-auto"
        />
      </div>
    </button>
  );
}
