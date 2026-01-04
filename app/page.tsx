"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, Zap, Menu, X } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LPBA Consulting',
    url: 'https://lpba-consulting.com',
    logo: 'https://lpba-consulting.com/logo.png',
    description: 'The Leadership Brand Positioning & Automation System designed for high-impact leaders.',
    sameAs: [
      'https://twitter.com/lpba_consulting',
      'https://linkedin.com/company/lpba-consulting',
    ],
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
       <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold font-display">L</div>
          <span className="font-bold text-xl tracking-tight font-display">LPBA Consulting</span>
        </Link>
        <nav className="ml-auto hidden sm:flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-gold transition-colors" href="/assessment">
            Assessment
          </Link>
          <Link className="text-sm font-medium hover:text-gold transition-colors" href="/application">
            Apply
          </Link>
          <Link className="text-sm font-medium hover:text-gold transition-colors" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:text-gold transition-colors" href="/register">
            Register
          </Link>
        </nav>
        <button
          aria-label="Open menu"
          className="ml-auto inline-flex items-center justify-center rounded-md p-2 text-gray-700 sm:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 sm:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-50 bg-white border-b shadow-md sm:hidden">
            <div className="px-4 py-3 flex items-center justify-between">
              <span className="font-semibold">Menu</span>
              <button
                aria-label="Close menu"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="px-4 pb-4 space-y-2">
              <Link
                href="/assessment"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Assessment
              </Link>
              <Link
                href="/application"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Apply
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100"
              >
                Register
              </Link>
            </nav>
          </div>
        </>
      )}
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 bg-black text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={stagger}
              className="flex flex-col items-center space-y-8 text-center"
            >
              <motion.div variants={fadeInUp} className="space-y-4 max-w-3xl">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-display">
                  Scale Your Influence. <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Automate Your Revenue.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The Leadership Brand Positioning & Automation System designed for high-impact leaders. Qualify leads, nurture relationships, and close high-ticket offers on autopilot.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                <Link href="/assessment">
                  <Button className="w-full sm:w-auto bg-white text-black hover:bg-gold hover:text-black text-lg px-8 py-6 h-auto font-semibold rounded-full transition-all duration-300" size="lg">
                    Take Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/application">
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-black text-lg px-8 py-6 h-auto font-semibold rounded-full transition-all duration-300">
                    View Programs
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-display">The LPBA System</h2>
              <p className="mx-auto max-w-[800px] text-gray-500 md:text-lg mt-4">
                We help you scale your influence and automate your revenue through a proven 3-step process designed for high-impact leaders.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white shadow-lg border-0 h-full hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="p-3 bg-blue-100 w-fit rounded-xl mb-4">
                      <Zap className="h-8 w-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl font-display">Qualify Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 leading-relaxed">
                      Stop wasting time on unqualified prospects. Our intelligent assessment engine identifies your ideal clients and routes them directly to your offers.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white shadow-lg border-0 h-full hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="p-3 bg-purple-100 w-fit rounded-xl mb-4">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <CardTitle className="text-xl font-display">Nurture Relationships</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 leading-relaxed">
                      Build trust at scale. Our content and branding strategies position you as the authority, nurturing leads into raving fans without you lifting a finger.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.3, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-white shadow-lg border-0 h-full hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="p-3 bg-green-100 w-fit rounded-xl mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl font-display">Close High-Ticket Offers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 leading-relaxed">
                      Revenue on autopilot. Implement our high-conversion funnels to close premium deals consistently, freeing you to focus on high-impact leadership.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-display">Program Packages</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 md:text-lg mt-4">
                Tailor-made engagements to position your brand and automate your growth.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
               {/* Basic Package */}
               <Card className="bg-gray-50 border h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl font-display">Basic</CardTitle>
                    <p className="text-sm text-gray-500 font-medium">Brand Foundation</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> 7 Days Intensive</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Positioning Strategy</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500"/> Self-Discovery & Meaning</li>
                    </ul>
                  </CardContent>
               </Card>

               {/* Standard Package */}
               <Card className="bg-white border-2 border-gold h-full flex flex-col relative shadow-xl md:scale-105 z-10">
                  <div className="absolute top-0 right-0 bg-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                  <CardHeader>
                    <CardTitle className="text-2xl font-display text-primary">Standard</CardTitle>
                    <p className="text-sm text-gray-500 font-medium">Growth Accelerator</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-gold"/> 3 Months Duration</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-gold"/> Automation Setup</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-gold"/> Creativity & Innovation</li>
                    </ul>
                  </CardContent>
               </Card>

               {/* Premium Package */}
               <Card className="bg-black text-white border h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl font-display text-white">Premium</CardTitle>
                    <p className="text-sm text-gray-400 font-medium">Market Dominance</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2 mb-6">
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white"/> 12 Months Partnership</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white"/> Full Scale Management</li>
                        <li className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-white"/> Value Inculcation</li>
                    </ul>
                  </CardContent>
               </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-blue-50">
             <div className="container px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tighter mb-4 font-display">Bonus Service: The 10X Revenue Launch</h2>
                        <p className="text-gray-600 mb-6 text-lg">
                            An optional, specialized service available immediately after the core training. We supervise the launch of a marketing campaign to increase your organization&rsquo;s visibility and patronage.
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm h-fit">
                                    <Zap className="h-6 w-6 text-gold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Goal</h3>
                                    <p className="text-gray-600">To engineer a 10x increase in your company&rsquo;s monthly revenue benchmark.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-white p-3 rounded-lg shadow-sm h-fit">
                                    <CheckCircle className="h-6 w-6 text-gold" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Value: ₦2,500,000 (Complimentary)</h3>
                                    <p className="text-gray-600">Included free of charge as a testament to our commitment to your accelerated growth.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 font-display">What You Get</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500"/> Fully designed marketing campaign</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500"/> Targeted sales strategy</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500"/> Launch supervision</li>
                            <li className="flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-500"/> Utilization of newly empowered staff</li>
                        </ul>
                        <Button className="w-full mt-8 bg-black text-white hover:bg-gold hover:text-black">Claim Your Bonus</Button>
                    </div>
                </div>
             </div>
        </section>

        <section className="w-full py-20 bg-black text-white text-center">
             <div className="container px-4 md:px-6">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6 font-display">Ready to Transform Your Leadership?</h2>
                <Link href="/assessment">
                  <Button className="bg-white text-black hover:bg-gold text-lg px-10 py-6 h-auto rounded-full font-bold transition-colors duration-300">
                    Start Your Journey Now
                  </Button>
                </Link>
             </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <p className="text-sm text-gray-500">© 2026 LPBA Consulting. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm text-gray-500 hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-sm text-gray-500 hover:underline underline-offset-4" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
