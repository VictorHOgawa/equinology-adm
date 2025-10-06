import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./Ui/pagination";

interface Props {
  pages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

export const CustomPagination = ({
  pages,
  currentPage,
  setCurrentPage,
}: Props) => {
  const handleFirst = () => {
    if (currentPage > 1) {
      setCurrentPage(1);
      return window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleLast = () => {
    if (currentPage < pages) {
      setCurrentPage(pages);
      return window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const getPageNumbers = () => {
    if (pages <= 3) {
      return [...Array.from({ length: pages }, (_, i) => i + 1)];
    }

    const visiblePages = new Set([1, pages, currentPage]);
    if (currentPage > 1) visiblePages.add(currentPage - 1);
    if (currentPage < pages) visiblePages.add(currentPage + 1);

    const pageNumbers = Array.from(visiblePages).sort((a, b) => a - b);
    const formattedPages: number[] = []; // Explicitly type the array as number[]

    for (let i = 0; i < pageNumbers.length; i++) {
      if (i > 0 && pageNumbers[i] !== pageNumbers[i - 1] + 1) {
        formattedPages.push(0);
      }
      formattedPages.push(pageNumbers[i]);
    }
    return formattedPages;
  };

  return (
    <Pagination className="">
      <PaginationContent>
        <PaginationPrevious
          onClick={handleFirst}
          className="cursor-pointer hover:bg-primary/40 hover:text-white"
        />
        {getPageNumbers().map((page, index) => (
          <PaginationItem key={index}>
            {page === 0 ? (
              <span className="px-2 text-white">...</span>
            ) : (
              <PaginationLink
                className={cn(
                  "cursor-pointer text-[10px] hover:bg-primary/40 hover:text-white xl:text-sm",
                  page === currentPage &&
                    "bg-white text-secondary hover:bg-primary hover:text-secondary",
                )}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}
        <PaginationNext
          onClick={handleLast}
          className="cursor-pointer hover:bg-primary/40 hover:text-white"
        />
      </PaginationContent>
    </Pagination>
  );
};
