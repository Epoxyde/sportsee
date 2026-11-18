import { formatChartDate } from "../utils/dates";

type PeriodNavigationProps = {
  startDate: string;
  endDate: string;
  previousLabel: string;
  nextLabel: string;
  onPrevious: () => void;
  onNext: () => void;
};

export function PeriodNavigation({ startDate, endDate, previousLabel, nextLabel, onPrevious, onNext }: PeriodNavigationProps) {
  const startYear = startDate.slice(0, 4);
  const endYear = endDate.slice(0, 4);
  const currentYear = String(new Date().getFullYear());
  const showYear = startYear !== currentYear || endYear !== currentYear;
  const buttonClass = "flex size-[26px] shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-[#717171] bg-white text-[#707070] transition-colors duration-200 ease-in-out hover:border-[#0b23f4] hover:bg-[#5465f7] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b23f4] motion-reduce:transition-none";

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <button type="button" aria-label={previousLabel} onClick={onPrevious} className={buttonClass}>
        <span aria-hidden="true" className="ml-0.5 size-1.5 rotate-135 border-r border-b border-current" />
      </button>
      <p className="text-center text-xs" aria-live="polite" aria-atomic="true">
        <time dateTime={startDate}>{formatChartDate(startDate)}</time>
        {" – "}<time dateTime={endDate}>{formatChartDate(endDate)}</time>
        {showYear && (
          <span className="block text-[10px] text-[#707070]">
            {startYear === endYear ? startYear : `${startYear} – ${endYear}`}
          </span>
        )}
      </p>
      <button type="button" aria-label={nextLabel} onClick={onNext} className={buttonClass}>
        <span aria-hidden="true" className="mr-0.5 size-1.5 -rotate-45 border-r border-b border-current" />
      </button>
    </div>
  );
}
