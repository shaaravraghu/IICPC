import { useState, useEffect } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Copy, Plus, BookOpen, TrendingUp, Building2, Smile, Check } from "lucide-react";

export type FunctionParam = {
  name: string;
  type: string;
  description: string;
  optional?: boolean;
};

export type FunctionDef = {
  id: string;
  name: string;
  category: "technical" | "fundamental" | "sentiment" | "orderbook" | "utility";
  description: string;
  signature: string;
  parameters?: FunctionParam[];
  returns?: string;
  tags?: string[];
};

type FunctionCatalogProps = {
  onInsertSnippet: (snippet: string) => void;
};

export default function FunctionCatalog({ onInsertSnippet }: FunctionCatalogProps) {
  const [functions, setFunctions] = useState<{
    technical: FunctionDef[];
    fundamental: FunctionDef[];
    sentiment: FunctionDef[];
  }>({ technical: [], fundamental: [], sentiment: [] });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFunctions() {
      try {
        const rustApiUrl = import.meta.env.VITE_RUST_API_URL || "http://localhost:8080";
        const response = await fetch(`${rustApiUrl}/api/functions`);
        if (!response.ok) {
          throw new Error(`Failed to fetch function catalog: ${response.statusText}`);
        }
        const data = await response.json();
        setFunctions({
          technical: data.technical || [],
          fundamental: data.fundamental || [],
          sentiment: data.sentiment || [],
        });
      } catch (err: any) {
        console.error("Error fetching functions:", err);
        setError(err.message || "Could not load function catalog");
      } finally {
        setLoading(false);
      }
    }
    fetchFunctions();
  }, []);

  const handleCopy = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateSnippet = (func: FunctionDef): string => {
    const skipParams = [
      "prices", "highs", "lows", "volumes", "benchmark_prices",
      "returns", "net_advances", "benchmark_returns", "evidence", "symbol"
    ];
    
    const relevantParams = func.parameters?.filter(p => !skipParams.includes(p.name)) || [];
    
    if (func.category === "sentiment") {
      const dimName = func.name.replace(/_analysis|_sentiment/g, "");
      return `  - name: ${dimName}
    weight_pct: 10
    call:
      name: ${func.name}
      params: {}`;
    }

    if (relevantParams.length === 0) {
      return `      - name: ${func.name}
        params: {}`;
    }

    const paramsYaml = relevantParams
      .map(p => `          ${p.name}:\n            Number: 10 # ${p.description}`)
      .join("\n");

    return `      - name: ${func.name}
        params:
${paramsYaml}`;
  };

  const filterList = (list: FunctionDef[]) => {
    if (!searchQuery) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(
      f =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.signature.toLowerCase().includes(q)
    );
  };

  const filteredTech = filterList(functions.technical);
  const filteredFund = filterList(functions.fundamental);
  const filteredSent = filterList(functions.sentiment);

  const totalCount = filteredTech.length + filteredFund.length + filteredSent.length;

  return (
    <div className="h-full flex flex-col bg-card/40 backdrop-blur-md border-l border-border overflow-hidden">
      <div className="p-4 border-b border-border space-y-3 shrink-0 bg-card/60">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold tracking-wider font-mono uppercase text-foreground">
            Function Library
          </span>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search metrics or indicators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-8 text-center text-xs text-muted-foreground font-mono">
            Loading function definitions...
          </div>
        ) : error ? (
          <div className="p-6 text-center space-y-2">
            <p className="text-xs text-destructive font-mono">Failed to load library</p>
            <p className="text-[11px] text-muted-foreground">{error}</p>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {searchQuery && (
              <div className="text-[11px] font-mono text-muted-foreground">
                Found {totalCount} matching functions
              </div>
            )}

            <Accordion type="single" collapsible defaultValue="technical" className="space-y-2">
              <AccordionItem value="technical" className="border rounded-md px-3 bg-card/25 hover:bg-card/45 transition-colors">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-chart-1" />
                    <span className="font-mono text-xs font-semibold uppercase text-foreground">
                      Technical ({filteredTech.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-1">
                  {filteredTech.map(f => (
                    <FunctionDetailCard
                      key={f.id || f.name}
                      func={f}
                      onInsert={onInsertSnippet}
                      onCopy={handleCopy}
                      copied={copiedId === f.name}
                      snippet={generateSnippet(f)}
                    />
                  ))}
                  {filteredTech.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">No technical functions found</div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="fundamental" className="border rounded-md px-3 bg-card/25 hover:bg-card/45 transition-colors">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-chart-2" />
                    <span className="font-mono text-xs font-semibold uppercase text-foreground">
                      Fundamental ({filteredFund.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-1">
                  {filteredFund.map(f => (
                    <FunctionDetailCard
                      key={f.id || f.name}
                      func={f}
                      onInsert={onInsertSnippet}
                      onCopy={handleCopy}
                      copied={copiedId === f.name}
                      snippet={generateSnippet(f)}
                    />
                  ))}
                  {filteredFund.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">No fundamental functions found</div>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="sentiment" className="border rounded-md px-3 bg-card/25 hover:bg-card/45 transition-colors">
                <AccordionTrigger className="hover:no-underline py-3">
                  <div className="flex items-center gap-2">
                    <Smile className="h-4 w-4 text-chart-3" />
                    <span className="font-mono text-xs font-semibold uppercase text-foreground">
                      Sentiment ({filteredSent.length})
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-1">
                  {filteredSent.map(f => (
                    <FunctionDetailCard
                      key={f.id || f.name}
                      func={f}
                      onInsert={onInsertSnippet}
                      onCopy={handleCopy}
                      copied={copiedId === f.name}
                      snippet={generateSnippet(f)}
                    />
                  ))}
                  {filteredSent.length === 0 && (
                    <div className="text-xs text-muted-foreground text-center py-4">No sentiment functions found</div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

function FunctionDetailCard({
  func,
  onInsert,
  onCopy,
  copied,
  snippet,
}: {
  func: FunctionDef;
  onInsert: (snippet: string) => void;
  onCopy: (id: string, snippet: string) => void;
  copied: boolean;
  snippet: string;
}) {
  return (
    <div className="p-3 border rounded bg-card/50 hover:border-primary/40 transition-colors space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-mono font-bold text-foreground">{func.name}</span>
        {func.returns && (
          <Badge variant="outline" className="text-[9px] font-mono py-0 px-1.5 h-4 bg-background">
            {func.returns}
          </Badge>
        )}
      </div>

      <p className="text-muted-foreground text-[11px] leading-relaxed">
        {func.description}
      </p>

      <div className="bg-background/80 border rounded p-1.5 font-mono text-[10px] text-muted-foreground select-all break-all overflow-x-auto whitespace-pre-wrap">
        {func.signature}
      </div>

      {func.parameters && func.parameters.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] uppercase font-semibold text-muted-foreground font-mono">Parameters:</div>
          <div className="space-y-1 border rounded bg-card/30 p-1.5 font-mono text-[10px]">
            {func.parameters.map(p => (
              <div key={p.name} className="flex flex-col border-b border-border/40 last:border-0 pb-1 mb-1 last:pb-0 last:mb-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-primary">{p.name}</span>
                  <span className="text-muted-foreground/60">({p.type})</span>
                  {p.optional && <span className="text-[9px] bg-muted px-1 rounded text-muted-foreground/75">optional</span>}
                </div>
                <span className="text-muted-foreground text-[10px] mt-0.5">{p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-[10px] font-mono flex-1 gap-1.5"
          onClick={() => onCopy(func.name, snippet)}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-primary animate-scaleIn" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy YAML
            </>
          )}
        </Button>
        <Button
          size="sm"
          className="h-7 text-[10px] font-mono flex-1 gap-1.5"
          onClick={() => onInsert(snippet)}
        >
          <Plus className="h-3 w-3" />
          Insert Snippet
        </Button>
      </div>
    </div>
  );
}
