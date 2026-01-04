"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // New Video Form State
  const [newVideo, setNewVideo] = useState<{
    title: string;
    description: string;
    file: File | null;
    thumbnail: string;
    minState: string;
  }>({
    title: "",
    description: "",
    file: null,
    thumbnail: "",
    minState: "CLIENT"
  });
  const [isSubmittingVideo, setIsSubmittingVideo] = useState(false);

  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.file) {
        alert("Please select a video file.");
        return;
    }

    setIsSubmittingVideo(true);
    try {
        const formData = new FormData();
        formData.append("title", newVideo.title);
        formData.append("description", newVideo.description);
        formData.append("thumbnail", newVideo.thumbnail);
        formData.append("minState", newVideo.minState);
        formData.append("videoFile", newVideo.file);

        const res = await fetch("/api/admin/videos", {
            method: "POST",
            body: formData
        });
        
        if (res.ok) {
            const video = await res.json();
            setVideos([video, ...videos]);
            setNewVideo({ title: "", description: "", file: null, thumbnail: "", minState: "CLIENT" });
            alert("Video added successfully!");
        } else {
            alert("Failed to add video.");
        }
    } catch (e) {
        alert("Error adding video.");
    } finally {
        setIsSubmittingVideo(false);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return;
    try {
        const res = await fetch(`/api/admin/videos/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setVideos(videos.filter(v => v.id !== id));
        } else {
            alert("Failed to delete video.");
        }
    } catch (e) {
        alert("Error deleting video.");
    }
  };

  const handleAccept = async (id: string) => {
    if (!confirm("Are you sure you want to accept this application?")) return;
    try {
        const res = await fetch(`/api/admin/applications/${id}/accept`, { method: 'POST' });
        if (res.ok) {
            alert("Application accepted!");
            // Optimistic update or reload
            setApplications(apps => apps.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
        } else {
            alert("Failed to accept.");
        }
    } catch (e) {
        alert("Error processing request.");
    }
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead? This action cannot be undone.")) return;
    try {
        const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setLeads(leads.filter(l => l.id !== id));
            alert("Lead deleted successfully.");
        } else {
            alert("Failed to delete lead.");
        }
    } catch (e) {
        alert("Error deleting lead.");
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
        alert("No leads to export.");
        return;
    }

    const headers = ["Name", "Email", "Phone", "State", "Automation", "Latest Result", "Date"];
    const csvContent = [
        headers.join(","),
        ...leads.map(lead => [
            `"${lead.name || ''}"`,
            `"${lead.email || ''}"`,
            `"${lead.phone || ''}"`,
            `"${lead.state || ''}"`,
            `"${lead.automationEnabled ? 'Active' : 'Paused'}"`,
            `"${lead.assessments?.[0]?.result || 'N/A'}"`,
            `"${new Date(lead.createdAt).toLocaleDateString()}"`
        ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetch("/api/admin/leads")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            setLeads(data);
        }
      });
      
    fetch("/api/admin/applications")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
            setApplications(data);
        }
      });
      
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then(setStats);

    fetch("/api/admin/videos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setVideos(data);
      });

    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setAnalytics);
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
          Sign Out
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Leads</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.totalLeads}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Applications</CardTitle></CardHeader>
                <CardContent><div className="text-2xl font-bold">{stats.totalApplications}</div></CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Pending Apps</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.applicationsByStatus?.find((s: any) => s.status === 'PENDING')?._count.status || 0}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Strong Candidates</CardTitle></CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {stats.applicationsByScore?.find((s: any) => s.score === 'STRONG')?._count.score || 0}
                    </div>
                </CardContent>
            </Card>
        </div>
      )}

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Online Conversion</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{analytics.onlineConversion.rate.toFixed(1)}%</div>
                    <p className="text-xs text-gray-500">
                        {analytics.onlineConversion.paid} paid / {analytics.onlineConversion.eligible} eligible
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">App Acceptance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(analytics.applications.ratio * 100).toFixed(1)}%</div>
                    <p className="text-xs text-gray-500">
                        {analytics.applications.accepted} accepted / {analytics.applications.total} total
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Monthly Revenue (Est.)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        ${analytics.revenue.length > 0 ? analytics.revenue[analytics.revenue.length - 1].revenue.toLocaleString() : "0"}
                    </div>
                    <p className="text-xs text-gray-500">
                        Last month
                    </p>
                </CardContent>
            </Card>
        </div>
      )}
      
      <Tabs defaultValue="leads" className="w-full">
        <TabsList>
          <TabsTrigger value="leads">Leads & Assessments</TabsTrigger>
          <TabsTrigger value="applications">Program Applications</TabsTrigger>
          <TabsTrigger value="videos">Mentorship Videos</TabsTrigger>
          <TabsTrigger value="analytics">Deep Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="leads">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Leads</CardTitle>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>A list of recent leads and their assessment status.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead>Bonus</TableHead>
                    <TableHead>Automation</TableHead>
                    <TableHead>Latest Result</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const phase = ['NEW', 'ASSESSMENT_COMPLETED'].includes(lead.state) ? 'Qualify' :
                                  ['NURTURING', 'ONLINE_CLIENT', 'APPLIED_PHYSICAL'].includes(lead.state) ? 'Nurture' :
                                  ['ACCEPTED', 'CLIENT'].includes(lead.state) ? 'Close' : lead.state;
                    
                    const pkg = ['ACCEPTED', 'CLIENT'].includes(lead.state) ? 'Premium' : '-';
                    const bonus = ['ACCEPTED', 'CLIENT'].includes(lead.state) ? 'Active' : 'Locked';

                    return (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium">{lead.name}</TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell>{lead.phone}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                            phase === 'Qualify' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            phase === 'Nurture' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                            'bg-green-50 text-green-700 border-green-200'
                        }>{phase}</Badge>
                      </TableCell>
                      <TableCell>{pkg}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={bonus === 'Active' ? 'bg-gold text-black' : ''}>{bonus}</Badge>
                      </TableCell>
                      <TableCell>
                        {lead.automationEnabled ? (
                          <span className="text-green-600 text-sm font-medium">Active</span>
                        ) : (
                          <span className="text-red-600 text-sm font-bold">Paused</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={lead.assessments?.[0]?.result === "High Potential" ? "default" : "secondary"}>
                          {lead.assessments?.[0]?.result || "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(lead.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleDeleteLead(lead.id)}
                        >
                            Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ); })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="applications">
          <Card>
            <CardHeader>
              <CardTitle>Program Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Applications for physical programs.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Program</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>
                        <div className="font-medium">{app.user.name}</div>
                        <div className="text-sm text-gray-500">{app.user.email}</div>
                      </TableCell>
                      <TableCell>{app.program}</TableCell>
                      <TableCell>
                        <Badge className={
                            app.score === 'STRONG' ? 'bg-green-600 hover:bg-green-700' :
                            app.score === 'MAYBE' ? 'bg-yellow-500 hover:bg-yellow-600' :
                            app.score === 'NOT_READY' ? 'bg-red-500 hover:bg-red-600' :
                            'bg-gray-400'
                        }>
                            {app.score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={app.status === "PENDING" ? "outline" : "default"}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {app.status === 'PENDING' && (
                            <Button size="sm" onClick={() => handleAccept(app.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
                                Accept
                            </Button>
                        )}
                      </TableCell>
                      <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Add Video Form */}
            <Card className="md:col-span-1">
                <CardHeader>
                    <CardTitle>Add New Video</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleCreateVideo} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input 
                                id="title" 
                                value={newVideo.title} 
                                onChange={(e) => setNewVideo({...newVideo, title: e.target.value})}
                                required
                                placeholder="Video Title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="videoFile">Upload Video</Label>
                            <Input 
                                id="videoFile" 
                                type="file"
                                accept="video/*"
                                onChange={(e) => setNewVideo({...newVideo, file: e.target.files ? e.target.files[0] : null})}
                                required
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="thumbnail">Thumbnail URL (Optional)</Label>
                            <Input 
                                id="thumbnail" 
                                value={newVideo.thumbnail} 
                                onChange={(e) => setNewVideo({...newVideo, thumbnail: e.target.value})}
                                placeholder="https://img.youtube.com/..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minState">Minimum Access Level</Label>
                            <Select 
                                value={newVideo.minState} 
                                onValueChange={(val) => setNewVideo({...newVideo, minState: val})}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NEW">NEW (Everyone)</SelectItem>
                                    <SelectItem value="ASSESSMENT_COMPLETED">Assessment Completed</SelectItem>
                                    <SelectItem value="NURTURING">Nurturing</SelectItem>
                                    <SelectItem value="ONLINE_CLIENT">Online Client</SelectItem>
                                    <SelectItem value="APPLIED_PHYSICAL">Applied Physical</SelectItem>
                                    <SelectItem value="ACCEPTED">Accepted</SelectItem>
                                    <SelectItem value="CLIENT">Client (Exclusive)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea 
                                id="description" 
                                value={newVideo.description} 
                                onChange={(e) => setNewVideo({...newVideo, description: e.target.value})}
                                placeholder="Short description..."
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmittingVideo}>
                            {isSubmittingVideo ? "Adding..." : "Add Video"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Video List */}
            <Card className="md:col-span-2">
                <CardHeader>
                    <CardTitle>Video Library ({videos.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {videos.length > 0 ? (
                        <div className="space-y-4">
                            {videos.map((video) => (
                                <div key={video.id} className="flex gap-4 p-4 border rounded-lg items-start bg-white">
                                    <div className="w-32 aspect-video bg-gray-100 flex-shrink-0">
                                        {video.thumbnail ? (
                                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover rounded" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Thumb</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold truncate">{video.title}</h4>
                                        <p className="text-xs text-gray-500 mb-2 truncate">{video.url}</p>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">{video.minState}</Badge>
                                        </div>
                                    </div>
                                    <Button 
                                        variant="destructive" 
                                        size="sm"
                                        onClick={() => handleDeleteVideo(video.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No videos in library.</p>
                    )}
                </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics">
            <Card>
                <CardHeader>
                    <CardTitle>Funnel Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    {analytics && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium mb-4">Leads per State</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {analytics.leadsPerState.map((stateGroup: any) => (
                                        <div key={stateGroup.state} className="p-4 border rounded bg-slate-50">
                                            <div className="text-sm text-gray-500 mb-1">{stateGroup.state}</div>
                                            <div className="text-2xl font-bold">{stateGroup._count.id}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-4">Revenue Trends</h3>
                                {analytics.revenue.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Month</TableHead>
                                                <TableHead>Revenue</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {analytics.revenue.map((rev: any) => (
                                                <TableRow key={rev.month}>
                                                    <TableCell>{rev.month}</TableCell>
                                                    <TableCell>${rev.revenue.toLocaleString()}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-gray-500">No revenue data available.</p>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
