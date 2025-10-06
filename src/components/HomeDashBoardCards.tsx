import { NumberFormatter } from "@/utils/NumberFormatter";

interface DashBoardCardProps {
  title: string;
  quantity: number;
  icon: React.ReactNode;
}

export function DashBoardCard({ title, quantity, icon }: DashBoardCardProps) {
  return (
    <div className="flex w-full min-w-[200px] flex-col justify-between gap-4 rounded-lg p-2 shadow-md md:flex-row lg:mx-auto">
      <span className="flex text-[12px] font-semibold text-[#67748E] md:hidden">
        {title}
      </span>
      <div className="flex flex-row items-center justify-between gap-4 md:flex-col md:items-start">
        <span className="hidden text-sm font-semibold text-[#67748E] md:flex">
          {title}
        </span>
        <span className="flex flex-row gap-1 text-lg font-bold text-[#252F40]">
          {quantity && NumberFormatter(quantity)}
        </span>
        <div className="flex h-8 w-8 min-w-8 rounded-md bg-gradient-to-r from-[#154734] to-[#27323F] p-1 md:hidden">
          {icon}
        </div>
      </div>
      <div className="hidden h-8 w-8 min-w-8 rounded-md bg-gradient-to-r from-[#154734] to-[#27323F] p-1 md:flex">
        {icon}
      </div>
    </div>
  );
}
