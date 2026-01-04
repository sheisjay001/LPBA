"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Lock, PlayCircle, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const JOURNEY_STAGES = [
  { id: 'QUALIFY', label: 'Qualify', step: 1, states: ['NEW', 'ASSESSMENT_COMPLETED'] },
  { id: 'NURTURE', label: 'Nurture', step: 2, states: ['NURTURING', 'ONLINE_CLIENT', 'APPLIED_PHYSICAL'] },
  { id: 'CLOSE', label: 'Close', step: 3, states: ['ACCEPTED', 'CLIENT'] },
];

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.email) {
      setLoading(true);
      // Fetch User Data
      fetch(`/api/user/dashboard?email=${session.user.email}`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch user data");
            return res.json();
        })
        .then((data) => setUserData(data))
        .catch(err => {
            console.error(err);
            toast.error("Could not load your profile data.");
        });

      // Fetch Videos
      fetch(`/api/user/videos?email=${session.user.email}`)
        .then((res) => {
            if (!res.ok) throw new Error("Failed to fetch videos");
            return res.json();
        })
        .then((data) => {
            if (Array.isArray(data)) setVideos(data);
        })
        .catch(err => {
            console.error(err);
            toast.error("Could not load video library.");
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [session, status]);

  const getCurrentStep = (state: string) => {
    const stage = JOURNEY_STAGES.find(s => s.states.includes(state));
    return stage ? stage.step : 1;
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-96" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-48 w-full rounded-xl" />
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-64 col-span-2 rounded-xl" />
            <Skeleton className="h-64 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null; // Middleware handles redirect

  const currentStep = userData ? getCurrentStep(userData.state) : 1;
  const isClient = userData?.state === 'CLIENT' || userData?.state === 'ACCEPTED';

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary tracking-tight">
              Welcome, {userData?.name || session?.user?.name || "Leader"}
            </h1>
            <p className="text-muted-foreground mt-2">Track your progress and access your exclusive resources.</p>
          </div>
          <Button variant="outline" onClick={() => signOut({ callbackUrl: "/" })} className="hover:bg-destructive hover:text-white transition-colors">
            Sign Out
          </Button>
        </div>

        {/* Journey Progress Bar */}
        <Card className="border-none shadow-lg bg-white/80 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-lg font-serif">The LPBA System</CardTitle>
                <CardDescription>Scale Influence. Automate Revenue.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="relative flex items-center justify-between w-full">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
                    <div 
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gold -z-10 transition-all duration-1000 ease-out" 
                        style={{ width: `${((currentStep - 1) / (JOURNEY_STAGES.length - 1)) * 100}%` }}
                    />
                    
                    {JOURNEY_STAGES.map((stage) => {
                        const isCompleted = stage.step <= currentStep;
                        const isCurrent = stage.step === currentStep;
                        
                        return (
                            <div key={stage.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                <div 
                                    className={`
                                        w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                        ${isCompleted ? 'bg-gold border-gold text-white' : 'bg-white border-gray-300 text-gray-300'}
                                        ${isCurrent ? 'ring-4 ring-gold/20 scale-110' : ''}
                                    `}
                                >
                                    {isCompleted ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                                </div>
                                <span className={`text-xs font-medium hidden md:block ${isCompleted ? 'text-gold' : 'text-gray-400'}`}>
                                    {stage.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>

        {/* Bonus Service: 10X Revenue Launch */}
        <div className="grid gap-6 md:grid-cols-3">
             <Card className="col-span-1 md:col-span-2 bg-gradient-to-br from-primary to-blue-900 text-white border-none shadow-xl">
                 <CardHeader>
                     <div className="flex justify-between items-start">
                         <div>
                             <Badge className="bg-gold text-black hover:bg-white mb-2">BONUS SERVICE</Badge>
                             <CardTitle className="text-2xl font-serif text-white">10X Revenue Launch</CardTitle>
                             <CardDescription className="text-gray-300">Valued at ₦2,500,000 (Complimentary)</CardDescription>
                         </div>
                         {isClient ? <CheckCircle2 className="h-8 w-8 text-gold" /> : <Lock className="h-6 w-6 text-gray-400" />}
                     </div>
                 </CardHeader>
                 <CardContent>
                     <p className="mb-4 text-gray-200">
                         We supervise the launch of a marketing campaign to increase your organization’s visibility and patronage.
                         Target: Engineer a 10x increase in monthly revenue.
                     </p>
                     <Button 
                        variant={isClient ? "default" : "secondary"} 
                        className={isClient ? "bg-gold text-black hover:bg-white" : "bg-gray-700 text-gray-400 cursor-not-allowed"}
                        disabled={!isClient}
                     >
                         {isClient ? "Activate Launch" : "Unlock with Membership"}
                     </Button>
                 </CardContent>
             </Card>

             {/* Current Package Status */}
             <Card className="bg-white shadow-md">
                 <CardHeader>
                     <CardTitle className="text-lg font-serif">Current Package</CardTitle>
                 </CardHeader>
                 <CardContent>
                     <div className="text-center py-4">
                         {isClient ? (
                             <>
                                 <div className="text-3xl font-bold text-primary mb-2">Premium</div>
                                 <p className="text-sm text-gray-500">Market Dominance</p>
                                 <Badge variant="outline" className="mt-4 border-green-500 text-green-600">Active</Badge>
                             </>
                         ) : (
                             <>
                                 <div className="text-xl font-bold text-gray-400 mb-2">No Active Package</div>
                                 <p className="text-sm text-gray-500 mb-4">Complete your assessment to find your fit.</p>
                                 <Button variant="outline" onClick={() => window.location.href="/application"}>View Packages</Button>
                             </>
                         )}
                     </div>
                 </CardContent>
             </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-xl">
                <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview & Applications</TabsTrigger>
                <TabsTrigger value="library" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Mentorship Library</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
                {/* Status Overview */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-primary">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Current Status</CardTitle></CardHeader>
                    <CardContent>
                      <Badge className="text-lg px-4 py-1 bg-primary text-primary-foreground hover:bg-primary/90">
                        {userData?.state?.replace(/_/g, " ") || "NEW"}
                      </Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-md transition-all duration-300 border-l-4 border-l-secondary">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Assessment Score</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold font-serif">
                            {userData?.assessments?.[0]?.result || "N/A"}
                        </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Action Required</CardTitle></CardHeader>
                    <CardContent>
                       {userData?.state === 'ACCEPTED' ? (
                           <Button className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200">Complete Payment</Button>
                       ) : (
                           <span className="text-gray-400 flex items-center gap-2"><CheckCircle2 size={16}/> All caught up</span>
                       )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Applications List */}
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="font-serif">My Applications</CardTitle>
                        <CardDescription>History of your program applications.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {userData?.applications?.length > 0 ? (
                            <div className="space-y-4">
                                {userData.applications.map((app: any) => (
                                    <div key={app.id} className="flex justify-between items-center p-4 border rounded-xl bg-gray-50/50 hover:bg-white transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{app.program}</h3>
                                                <p className="text-xs text-muted-foreground">Submitted on {new Date(app.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={app.status === 'APPROVED' ? 'default' : 'secondary'}>
                                                {app.status}
                                            </Badge>
                                            {app.status === 'APPROVED' && app.paymentLink && (
                                                <a href={app.paymentLink} className="text-sm text-blue-600 hover:underline font-medium">
                                                    Pay Now →
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed rounded-xl">
                                <p className="text-muted-foreground">No applications submitted yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="library" className="mt-6">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle className="font-serif">Mentorship Library</CardTitle>
                        <CardDescription>Exclusive video content curated for your journey.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {videos.map((video, idx) => (
                                    <motion.div 
                                        key={video.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="group border rounded-xl overflow-hidden bg-white hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className="aspect-video w-full bg-black relative group-hover:scale-105 transition-transform duration-500">
                                            {video.url.startsWith('/') ? (
                                                <video 
                                                    src={video.url} 
                                                    controls 
                                                    className="w-full h-full object-cover"
                                                    poster={video.thumbnail}
                                                />
                                            ) : (
                                                <iframe 
                                                    src={video.url} 
                                                    title={video.title}
                                                    className="w-full h-full"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 pointer-events-none transition-colors" />
                                        </div>
                                        <div className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors">{video.title}</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{video.description}</p>
                                            <div className="flex items-center justify-between mt-auto pt-4 border-t">
                                                 <Badge variant="outline" className="text-xs bg-gray-50">
                                                    {video.minState} Level
                                                 </Badge>
                                                 <PlayCircle size={20} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300" />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <Lock className="text-gray-400" size={32} />
                                </div>
                                <p className="text-lg font-medium text-gray-900">Content Locked</p>
                                <p className="text-gray-500 mt-2">Complete more steps to unlock content.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}