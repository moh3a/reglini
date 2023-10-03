import { ReactNode } from "react";
import { useRouter } from "next/router";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

import { SHADOW } from "~/config/design";

interface PaginationProps {
  current: number;
  unitsPerPage: number;
  totalUnits: number;
}

export const PageNumber = ({
  children,
  href,
  p,
}: {
  href?: string;
  p?: number;
  children: ReactNode;
}) => {
  const router = useRouter();
  return (
    <a
      onClick={() =>
        router.push({ href, query: { ...router.query, p: p?.toString() } })
      }
      className={`relative cursor-pointer flex justify-center items-center w-6 h-6 mx-0.5 rounded-full ${SHADOW} text-sm font-medium`}
    >
      {children}
    </a>
  );
};

export const Pagination = ({
  current,
  totalUnits,
  unitsPerPage,
}: PaginationProps) => {
  const router = useRouter();

  return (
    <div className="max-w-lg mt-2 mx-auto flex-1 flex items-center justify-center">
      <nav className="relative z-0 items-center flex" aria-label="Pagination">
        <PageNumber
          href={router.asPath.split("?")[0]}
          p={current - 1 <= 0 ? undefined : current - 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </PageNumber>
        <p className="text-xs lg:text-sm font-mono mx-2">Page {current}</p>
        <PageNumber
          href={router.asPath.split("?")[0]}
          p={current * unitsPerPage > totalUnits ? current : current + 1}
        >
          <span className="sr-only">Next</span>
          <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
        </PageNumber>
      </nav>
    </div>
  );
};
