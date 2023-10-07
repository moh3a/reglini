import type { ReactNode } from "react";
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
        void router.push({ href, query: { ...router.query, p: p?.toString() } })
      }
      className={`relative mx-0.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full ${SHADOW} text-sm font-medium`}
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
    <div className="mx-auto mt-2 flex max-w-lg flex-1 items-center justify-center">
      <nav className="relative z-0 flex items-center" aria-label="Pagination">
        <PageNumber
          href={router.asPath.split("?")[0]}
          p={current - 1 <= 0 ? undefined : current - 1}
        >
          <span className="sr-only">Previous</span>
          <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
        </PageNumber>
        <p className="mx-2 font-mono text-xs lg:text-sm">Page {current}</p>
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
