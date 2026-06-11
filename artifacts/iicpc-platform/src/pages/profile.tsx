import { useState } from "react";
import { useUser } from "@clerk/react";
import {
  useGetProfile,
  getGetProfileQueryKey,
  useUpdateProfile,
  useListSubmissions,
  getListSubmissionsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Github, Edit, Trophy, Zap, Check, X } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(2),
  bio: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  teamName: z.string().optional(),
});

const STATUS_COLORS: Record<string, string> = {
  completed: "text-primary",
  failed: "text-destructive",
  running: "text-chart-2",
  building: "text-chart-1",
  pending: "text-muted-foreground",
};

export default function Profile() {
  let user: any = null;
  try {
    const authUser = useUser();
    user = authUser.user;
  } catch (e) {
    // Local dev mockup bypass
  }
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);

  const { data: profile, isLoading } = useGetProfile({
    query: { queryKey: getGetProfileQueryKey() }
  });

  const { data: submissions } = useListSubmissions(
    { userId: user?.id ?? undefined },
    { query: { queryKey: getListSubmissionsQueryKey({ userId: user?.id ?? undefined }) } }
  );

  const updateProfile = useUpdateProfile();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      username: profile?.username ?? "",
      bio: profile?.bio ?? "",
      githubUrl: profile?.githubUrl ?? "",
      teamName: profile?.teamName ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    await updateProfile.mutateAsync({ data: values });
    await queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
    setEditing(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex items-start gap-6 p-6 bg-card border border-border rounded">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary/20 text-primary text-xl font-bold">
              {(profile?.username ?? user?.firstName ?? "?")[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            {!editing ? (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-xl font-bold">{profile?.username}</h1>
                  {profile?.rank != null && (
                    <Badge variant="outline" className="text-xs font-mono">
                      <Trophy className="h-3 w-3 mr-1" /> Rank #{profile.rank}
                    </Badge>
                  )}
                </div>
                {profile?.teamName && (
                  <div className="text-sm text-muted-foreground mb-1">{profile.teamName}</div>
                )}
                <div className="text-xs text-muted-foreground mb-2">{profile?.email}</div>
                {profile?.bio && <p className="text-sm text-foreground/80 mb-2">{profile.bio}</p>}
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                    data-testid="link-github">
                    <Github className="h-3 w-3" />{profile.githubUrl.replace("https://github.com/", "@")}
                  </a>
                )}
                <div className="flex gap-4 mt-4">
                  <div>
                    <div className="text-xs text-muted-foreground font-mono uppercase">Submissions</div>
                    <div className="text-xl font-bold font-mono">{profile?.totalSubmissions ?? 0}</div>
                  </div>
                  {profile?.bestScore != null && (
                    <div>
                      <div className="text-xs text-muted-foreground font-mono uppercase">Best Score</div>
                      <div className="text-xl font-bold font-mono text-primary">{profile.bestScore.toFixed(1)}</div>
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 gap-1 text-xs"
                  onClick={() => setEditing(true)}
                  data-testid="button-edit-profile"
                >
                  <Edit className="h-3 w-3" /> Edit Profile
                </Button>
              </>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
                  <div className="grid grid-cols-2 gap-3">
                    <FormField control={form.control} name="username" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Username</FormLabel>
                        <FormControl><Input className="h-8 text-sm" {...field} data-testid="input-username" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="teamName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Team Name</FormLabel>
                        <FormControl><Input className="h-8 text-sm" {...field} data-testid="input-team-name" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={form.control} name="bio" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Bio</FormLabel>
                      <FormControl><Textarea className="text-sm resize-none h-16" {...field} data-testid="input-bio" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="githubUrl" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">GitHub URL</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Github className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                          <Input className="h-8 text-sm pl-8" placeholder="https://github.com/username" {...field} data-testid="input-github" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={updateProfile.isPending} className="gap-1 text-xs" data-testid="button-save">
                      <Check className="h-3 w-3" /> Save
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditing(false)} className="gap-1 text-xs" data-testid="button-cancel">
                      <X className="h-3 w-3" /> Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>

        {submissions && submissions.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold font-mono uppercase tracking-widest text-muted-foreground mb-3">Submission History</h2>
            <div className="space-y-2">
              {submissions.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-card border border-border rounded" data-testid={`row-submission-${s.id}`}>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[10px] font-mono">{s.language.toUpperCase()}</Badge>
                    <div>
                      <div className="text-sm font-mono">{s.filename}</div>
                      <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono">
                    {s.compositeScore != null && (
                      <div className="text-right">
                        <div className="text-muted-foreground uppercase">Score</div>
                        <div className="text-primary font-bold">{s.compositeScore.toFixed(1)}</div>
                      </div>
                    )}
                    {s.p99Latency != null && (
                      <div className="text-right hidden md:block">
                        <div className="text-muted-foreground uppercase">p99</div>
                        <div>{s.p99Latency.toFixed(1)}ms</div>
                      </div>
                    )}
                    {s.tps != null && (
                      <div className="text-right hidden md:block">
                        <div className="text-muted-foreground uppercase">TPS</div>
                        <div>{s.tps.toFixed(0)}</div>
                      </div>
                    )}
                    <div className={`uppercase font-semibold ${STATUS_COLORS[s.status] ?? "text-muted-foreground"}`}>
                      {s.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
