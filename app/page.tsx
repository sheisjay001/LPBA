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
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-gold/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="w-8 h-8 bg-gold text-black flex items-center justify-center rounded-lg font-bold font-display">L</div>
          <span className="font-bold text-xl tracking-tight font-display text-black">LPBA Consulting</span>
        </Link>
        <nav className="ml-auto hidden sm:flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-gold-dark transition-colors" href="/assessment">
            Assessment
          </Link>
          <Link className="text-sm font-medium hover:text-gold-dark transition-colors" href="/application">
            Apply
          </Link>
          <Link className="text-sm font-medium hover:text-gold-dark transition-colors" href="/login">
            Login
          </Link>
          <Link className="text-sm font-medium hover:text-gold-dark transition-colors" href="/register">
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
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl font-display">
                  Grow Your Business by Empowering You and Your Teams.
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 text-base md:text-lg leading-relaxed">
                  Unlock your organization&rsquo;s revenue potential by aligning strategy with staff competence to maximize profit.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 min-w-[200px]">
                <Link href="/assessment">
                  <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-6 h-auto font-semibold rounded-full transition-all duration-300 active:bg-secondary/90" size="lg">
                    Take Free Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/application">
                  <Button variant="secondary" className="w-full sm:w-auto text-lg px-8 py-6 h-auto font-semibold rounded-full transition-all duration-300 active:bg-secondary/90">
                    View Programs
                  </Button>
                </Link>
              </motion.div>
              
            </motion.div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gray-50 dark:bg-gray-900 border-t border-gold/20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-display text-gold-dark">The LPBA System</h2>
              <p className="mx-auto max-w-[800px] text-gray-500 text-base md:text-lg mt-4 leading-relaxed">
                We help organizations grow by bridging the gap between vision and performance
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
                    <div className="p-3 bg-gold/20 w-fit rounded-xl mb-4">
                      <Zap className="h-6 w-6 text-gold-dark" />
                    </div>
                    <CardTitle className="text-2xl font-display text-gold-dark">Soft Skills Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                      We equip your staff with the essential communication, emotional intelligence, problem-solving skills etc needed to execute your vision with precision.
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
                    <div className="p-3 bg-gold/20 w-fit rounded-xl mb-4">
                      <Users className="h-6 w-6 text-gold-dark" />
                    </div>
                    <CardTitle className="text-2xl font-display text-gold-dark">Marketing Strategy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                      We build data-driven positioning strategies that articulate your unique value, attracting high-tier clients and creating a clear path to multiplied revenue.
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
                    <div className="p-3 bg-gold/20 w-fit rounded-xl mb-4">
                      <CheckCircle className="h-6 w-6 text-gold-dark" />
                    </div>
                    <CardTitle className="text-2xl font-display text-gold-dark">Executive Coaching</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                      We sharpen executive decision-making and strategic vision, ensuring those at the top have the clarity and mindset required to lead a scaling organization.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gold/10 border-t border-gold/20">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-display text-gold-dark">Program Packages</h2>
              <p className="mx-auto max-w-[600px] text-gray-500 text-base md:text-lg mt-4 leading-relaxed">
                To help your clients choose the right level of engagement, these tiers are structured by depth of impact—moving from foundational skills to full-scale organizational transformation.
              </p>
              <h3 className="text-xl font-semibold mt-6 font-display text-gold-dark">Select Your Preferred Package</h3>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
               {/* Basic Package */}
               <Card className="bg-white border border-gold/40 h-full flex flex-col">
                  <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-display text-gold-dark">Basic: Foundation</CardTitle>
                    <p className="text-sm text-gray-500 font-medium">Best for Junior Staff</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4 mb-6">
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500"/> 4 Days Intensive</li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5"/> 
                          <div>
                            <span className="font-medium">Skill Mastery:</span>
                            <p className="text-gray-600">Acquire the essential soft skills e.g loyalty, communication, productivity and marketing etcetera.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5"/> 
                          <div>
                            <span className="font-medium">Individual Clarity:</span>
                            <p className="text-gray-600">Discover how to connect individual goals and strengths align with the organization, for efficiency.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5"/> 
                          <div>
                            <span className="font-medium">Performance Optimization:</span>
                            <p className="text-gray-600">Identify how to be results oriented, focused and excellent.</p>
                          </div>
                        </li>
                    </ul>
                  </CardContent>
               </Card>

               {/* Standard Package */}
               <Card className="bg-white border-2 border-gold h-full flex flex-col relative shadow-xl md:scale-105 z-10">
                  <div className="absolute top-0 right-0 bg-gold text-white text-xs font-bold px-3 py-1 rounded-bl-lg">POPULAR</div>
                  <CardHeader>
                    <CardTitle className="text-2xl font-display text-gold-dark">Standard: Acceleration</CardTitle>
                    <p className="text-sm text-gray-500 font-medium">Best for managers  between strategy and execution.</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4 mb-6">
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-gold-dark"/> 3Months Duration</li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-gold-dark"/> 
                          <span className="font-medium">Team Alignment:</span> Synchronize staff performance with your brand&rsquo;s core purpose for a unified market presence.
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-gold-dark"/> 
                          <span className="font-medium">Operational Efficiency:</span> Implement management frameworks that reduce internal friction and speed up project delivery.
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-gold-dark"/> 
                          <span className="font-medium">Sustainable Growth:</span> Build the leadership middle-layer required to support scaling revenue without owner burnout.
                        </li>
                    </ul>
                  </CardContent>
               </Card>

               {/* Premium Package */}
               <Card className="bg-black text-white border border-gold/40 h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-2xl font-display text-gold-dark">Premium: Transformation</CardTitle>
                    <p className="text-sm text-gray-400 font-medium">Best for executives and high-impact organizations.</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-4 mb-6">
                        <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-white"/> 12 Months Partnership</li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-white mt-0.5"/> 
                          <div>
                            <span className="font-medium">Strategic Dominance:</span>
                            <p className="text-gray-300">Refine your marketing strategy and brand positioning to command premium market pricing.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-white mt-0.5"/> 
                          <div>
                            <span className="font-medium">Executive Excellence:</span>
                            <p className="text-gray-300">Master high-stakes decision-making through 1-on-1 coaching for founders and C-suite leaders.</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-white mt-0.5"/> 
                          <div>
                            <span className="font-medium">Compound Revenue:</span>
                            <p className="text-gray-300">Integrate staff, management, and executive development into a singular engine for maximum profit.</p>
                          </div>
                        </li>
                    </ul>
                  </CardContent>
               </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-gold/10 border-t border-gold/20">
             <div className="container px-4 md:px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 font-display text-gold-dark">Bonus Service: The 10X Revenue Launch</h2>
                        <p className="text-gray-600 mb-6 text-base md:text-lg leading-relaxed">
                            An optional, specialized service available immediately after the core training. We supervise the launch of a marketing campaign to increase your organization&rsquo;s visibility and patronage.
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="bg-white p-3 rounded-lg shadow-sm h-fit">
                                    <Zap className="h-6 w-6 text-gold-dark" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Goal</h3>
                                    <p className="text-gray-600">To engineer a 10x increase in your company&rsquo;s monthly revenue benchmark.</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <div className="bg-white p-3 rounded-lg shadow-sm h-fit">
                                    <CheckCircle className="h-6 w-6 text-gold-dark" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">$2,000 ( Already Paid for You By the Company)</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gold/40">
                        <h3 className="text-xl font-bold mb-4 font-display text-gold-dark">What You Get</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500"/> Fully designed marketing campaign</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500"/> Targeted sales strategy</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500"/> Launch supervision</li>
                            <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-green-500"/> Utilization of newly empowered staff</li>
                        </ul>
                        <Button variant="secondary" className="w-full mt-8">Claim Your Bonus</Button>
                    </div>
                </div>
             </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-white border-t border-gold/20">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-display text-center text-gold-dark">Training Philosophy</h2>
            <p className="text-gray-600 mt-4 text-center mx-auto max-w-3xl">At LPBA, we believe:</p>
            <ul className="mt-6 space-y-4 max-w-3xl mx-auto text-left">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold-dark mt-0.5" />
                <span className="leading-relaxed">The combined capacity of the CEO and employees determines company results and growth.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold-dark mt-0.5" />
                <span className="leading-relaxed">Your needs are unique; we customize a training framework to fit your organization.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold-dark mt-0.5" />
                <span className="leading-relaxed">Marketing and sales are the lifeline of every business; we teach them to all staff.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gold-dark mt-0.5" />
                <span className="leading-relaxed">Without loyalty, organizations fail.</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="w-full py-20 bg-black text-white text-center border-t border-gold/20">
             <div className="container px-4 md:px-6">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6 font-display">Ready to Transform Your Leadership?</h2>
                <Link href="/assessment">
                  <Button className="bg-white text-black hover:bg-gold text-lg px-10 py-6 h-auto rounded-full font-bold transition-colors duration-300">
                    Start Your Journey Now
                  </Button>
                </Link>
             </div>
        </section>
      </main>
      <footer className="flex flex-col gap-4 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-gold bg-gold/10">
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
