export const ClientCardSkeleton = ({}) => (
  <li className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
    <div className="mb-2 flex items-start justify-between">
      <h3 className="animate-pulse bg-zinc-400 text-sm font-semibold text-primary text-transparent">
        Carregando
      </h3>
      <div className="flex w-full max-w-[110px] animate-pulse items-center justify-center rounded-md border bg-zinc-400 px-3 py-1 text-xs font-semibold text-transparent"></div>
    </div>

    <dl className="space-y-1 text-xs text-black">
      <div className="flex justify-between gap-2">
        <dt className="animate-pulse bg-zinc-400 text-transparent">
          Carregando
        </dt>
        <dd className="max-w-[60%] animate-pulse truncate bg-zinc-400 text-right font-medium text-transparent">
          Carregando
        </dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="animate-pulse bg-zinc-400 text-transparent">
          Carregando
        </dt>
        <dd className="max-w-[60%] animate-pulse truncate bg-zinc-400 text-right font-medium text-transparent">
          Carregando
        </dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="animate-pulse bg-zinc-400 text-transparent">
          Carregando
        </dt>
        <dd className="max-w-[60%] animate-pulse truncate bg-zinc-400 text-right font-medium text-transparent">
          Carregando
        </dd>
      </div>
      <div className="flex justify-between gap-2">
        <dt className="animate-pulse bg-zinc-400 text-transparent">
          Carregando
        </dt>
        <dd className="max-w-[60%] animate-pulse truncate bg-zinc-400 text-right font-medium text-transparent">
          Carregando
        </dd>
      </div>
    </dl>
  </li>
);
