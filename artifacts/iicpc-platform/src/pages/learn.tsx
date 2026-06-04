import { useState } from "react";
import {
  useListFunctions,
  getListFunctionsQueryKey,
  useGetFunction,
  getGetFunctionQueryKey,
} from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, BookOpen, ChevronRight } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  technical: "Technical Analysis",
  fundamental: "Fundamental Analysis",
  sentiment: "Sentiment Analysis",
  orderbook: "Orderbook",
  utility: "Utility",
};

const CATEGORY_COLORS: Record<string, string> = {
  technical: "bg-chart-1/20 text-chart-1 border-chart-1/30",
  fundamental: "bg-chart-2/20 text-chart-2 border-chart-2/30",
  sentiment: "bg-chart-3/20 text-chart-3 border-chart-3/30",
  orderbook: "bg-primary/20 text-primary border-primary/30",
  utility: "bg-muted text-muted-foreground border-border",
};

function FunctionDetail({ id }: { id: string }) {
  const { data, isLoading } = useGetFunction(id, {
    query: { queryKey: getGetFunctionQueryKey(id) }
  });

  if (isLoading) return (
    <div className="space-y-4 p-1">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
  if (!data) return null;

  const params = data.parameters ?? [];
  const tags = data.tags ?? [];

  return (
    <div className="space-y-5">
      <div>
        <Badge variant="outline" className={`text-xs mb-2 ${CATEGORY_COLORS[data.category] ?? ""}`}>
          {CATEGORY_LABELS[data.category] ?? data.category}
        </Badge>
        <p className="text-sm text-muted-foreground">{data.description}</p>
      </div>

      <div>
        <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Signature</div>
        <pre className="bg-[hsl(240_10%_6%)] border border-border rounded p-3 text-xs font-mono text-primary overflow-x-auto">{data.signature}</pre>
      </div>

      {params.length > 0 && (
        <div>
          <div className="text-xs font-mono text-muted-foreground uppercase mb-2">Parameters</div>
          <div className="space-y-2">
            {params.map((p) => (
              <div key={p.name} className="flex gap-3 text-xs">
                <code className="font-mono text-chart-1 shrink-0">{p.name}</code>
                <code className="font-mono text-muted-foreground shrink-0">{p.type}</code>
                <span className="text-muted-foreground">{p.description}{p.optional && " (optional)"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.returns && (
        <div>
          <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Returns</div>
          <code className="text-xs font-mono text-chart-2">{data.returns}</code>
        </div>
      )}

      {data.codeExample && (
        <div>
          <div className="text-xs font-mono text-muted-foreground uppercase mb-1">Example</div>
          <pre className="bg-[hsl(240_10%_6%)] border border-border rounded p-3 text-xs font-mono overflow-x-auto whitespace-pre-wrap">{data.codeExample}</pre>
        </div>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Learn() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: functions, isLoading } = useListFunctions(
    { q: search || undefined, category },
    { query: { queryKey: getListFunctionsQueryKey({ q: search || undefined, category }) } }
  );

  const grouped = functions?.reduce((acc, fn) => {
    if (!acc[fn.category]) acc[fn.category] = [];
    acc[fn.category].push(fn);
    return acc;
  }, {} as Record<string, NonNullable<typeof functions>>) ?? {};

  const categoryOrder = ["technical", "fundamental", "sentiment", "orderbook", "utility"];
  const selectedName = selectedId ? functions?.find((f) => f.id === selectedId)?.name : undefined;

  return (
    <div className="h-full flex flex-col">
      <div className="px-8 py-6 border-b border-border bg-card/30 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Functions Library</h1>
        <p className="text-sm text-muted-foreground">Predefined analysis and orderbook primitives</p>
        <div className="flex gap-3 mt-4 flex-wrap">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search functions..."
              className="pl-9 h-9 text-sm font-mono"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <Badge
              variant={category === undefined ? "default" : "outline"}
              className="cursor-pointer text-xs h-9 px-3"
              onClick={() => setCategory(undefined)}
            >All</Badge>
            {categoryOrder.map((cat) => (
              <Badge
                key={cat}
                variant={category === cat ? "default" : "outline"}
                className={`cursor-pointer text-xs h-9 px-3 ${category === cat ? "" : (CATEGORY_COLORS[cat] ?? "")}`}
                onClick={() => setCategory(category === cat ? undefined : cat)}
              >
                {CATEGORY_LABELS[cat]}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-8 py-6 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : (functions?.length ?? 0) === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No functions found</p>
            </div>
          ) : (
            categoryOrder.filter((cat) => (grouped[cat]?.length ?? 0) > 0).map((cat) => (
              <div key={cat}>
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-semibold uppercase tracking-widest font-mono text-muted-foreground">{CATEGORY_LABELS[cat]}</h2>
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs text-muted-foreground font-mono">{grouped[cat]?.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {grouped[cat]?.map((fn) => (
                    <div
                      key={fn.id}
                      className="group bg-card border border-border rounded p-4 cursor-pointer hover:border-primary/50 transition-colors"
                      onClick={() => setSelectedId(fn.id)}
                      data-testid={`card-function-${fn.id}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-sm font-semibold text-foreground truncate">{fn.name}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{fn.description}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                      </div>
                      {(fn.tags?.length ?? 0) > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {fn.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] h-4">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <Sheet open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto bg-card border-l border-border">
          <SheetHeader className="mb-5">
            <SheetTitle className="font-mono">{selectedName ?? ""}</SheetTitle>
          </SheetHeader>
          {selectedId && <FunctionDetail id={selectedId} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}
