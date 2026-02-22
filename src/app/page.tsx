"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Search, MapPin, Send, CheckCircle, Menu, Database, Bell, UserCheck, ArrowRight, Lock, Quote } from "lucide-react";

const steps = [
  {
    icon: Database,
    title: "1. Verified Government Data",
    description: "We continuously sync with the official BC Government child care database. Every facility on our map is a registered, legitimate provider. No fake listings.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
  },
  {
    icon: MapPin,
    title: "2. Set Your Criteria",
    description: "Filter by area (e.g., Coquitlam, Burnaby), child age, and start date. We instantly generate a list of all matching facilities, even the 80% that don't have websites.",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
  },
  {
    icon: Send,
    title: "3. One-Click Mass Contact",
    description: "Stop dialing phone numbers. Our engine sends personalized SMS and email inquiries to dozens of offline daycares simultaneously on your behalf.",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400"
  },
  {
    icon: Bell,
    title: "4. Only Get the \"Yes\"",
    description: "We protect your privacy and filter out the rejections. You only get notified when a daycare replies with available spots or open waitlists.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400"
  },
  {
    icon: UserCheck,
    title: "5. The Provider Loop",
    description: "Daycares can claim their profile and digitize their business. To ensure security, providers must verify their identity using the official government phone number on record via an automated code.",
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-sm">
              <Search className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-[15px] text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors">Search</Link>
            <Link href="/providers" className="hover:text-primary transition-colors">For Providers</Link>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="rounded-full font-semibold px-5">
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <Button size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all font-semibold px-6" asChild>
              <Link href="/dashboard">Find Care Now</Link>
            </Button>
          </nav>

          {/* Mobile Nav Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-7 w-7" />
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 pt-24 pb-8 md:pt-36 md:pb-12 overflow-hidden">
          <div className="container mx-auto max-w-5xl text-center flex flex-col items-center relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary mb-10 bg-primary/5 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Now finding spots in Vancouver & Metro BC
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-8 text-balance leading-[1.1] md:leading-[1.1]">
              Find a Daycare in BC without the <span className="text-primary block mt-2">Phone Tag Nightmare.</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-12 text-balance max-w-3xl leading-relaxed font-medium">
              We scan government data and automatically contact hundreds of daycares for you. You just get the replies.
            </p>
            <div className="flex flex-col items-center w-full mt-6 relative z-20">
              <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full scale-150 -z-10 animate-pulse" />
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="group relative text-xl h-20 w-full sm:w-auto px-14 rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.8)] hover:-translate-y-1 transition-all duration-300 border-2 border-primary/20 bg-primary/95 hover:bg-primary font-bold overflow-hidden">
                    <span className="relative z-10 flex items-center">
                      Start Auto-Search
                      <Search className="ml-3 h-6 w-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="group relative text-xl h-20 w-full sm:w-auto px-14 rounded-full shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.8)] hover:-translate-y-1 transition-all duration-300 border-2 border-primary/20 bg-primary/95 hover:bg-primary font-bold overflow-hidden" asChild>
                  <Link href="/dashboard">
                    <span className="relative z-10 flex items-center">
                      Start Auto-Search
                      <Search className="ml-3 h-6 w-6 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                    </span>
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </Link>
                </Button>
              </SignedIn>
              <p className="mt-4 text-sm font-medium text-muted-foreground/80 flex items-center gap-1.5">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                Takes 2 minutes to set up
              </p>
              <Button size="lg" variant="outline" className="mt-4 text-base h-14 px-10 rounded-full bg-background/50 hover:bg-muted/50 border-border/60 font-semibold transition-all" asChild>
                <Link href="/providers">
                  For Providers →
                </Link>
              </Button>
              <p className="mt-6 text-xs text-muted-foreground/70 flex items-center gap-1.5 font-medium">
                <Lock className="h-3.5 w-3.5" />
                Verified Data: Synced securely with official BC Gov child care registries.
              </p>
            </div>
          </div>

          {/* Decorative background elements for aesthetics WOW factor */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1400px] h-full -z-10 pointer-events-none opacity-60 dark:opacity-30">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute top-1/3 right-1/4 w-[28rem] h-[28rem] bg-amber-200/40 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-[30rem] h-[30rem] bg-indigo-200/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
          </div>
        </section>

        {/* Value Props Section */}
        <section className="py-10 md:py-16 bg-gradient-to-b from-transparent to-card/50 border-t border-border/30 relative">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="grid md:grid-cols-3 gap-12 lg:gap-16">

              {/* Prop 1 */}
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="h-20 w-20 rounded-3xl bg-blue-100/60 dark:bg-blue-900/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-blue-200/50 dark:border-blue-800/30">
                  <MapPin className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Gov-Backed Data</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Synced with BC&apos;s official child care map.
                </p>
              </div>

              {/* Prop 2 */}
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="h-20 w-20 rounded-3xl bg-amber-100/60 dark:bg-amber-900/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-amber-200/50 dark:border-amber-800/30">
                  <Send className="h-10 w-10 text-amber-600 dark:text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Auto-Outreach</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  One-click email & SMS blasts to waitlists.
                </p>
              </div>

              {/* Prop 3 */}
              <div className="flex flex-col items-center text-center group cursor-default">
                <div className="h-20 w-20 rounded-3xl bg-emerald-100/60 dark:bg-emerald-900/40 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-emerald-200/50 dark:border-emerald-800/30">
                  <CheckCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Real Availability</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Verified providers update their own spots.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS TIMELINE SECTION */}
        <section id="how-it-works" className="py-24 md:py-32 bg-slate-50 dark:bg-slate-900/50 border-t border-border/40 relative">
          <div className="container mx-auto px-6 max-w-5xl">

            {/* Section Header */}
            <div className="text-center mb-20 md:mb-28">
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-6">
                How AutoDayCare BC Works
              </h2>
              <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                The stress-free process designed to put finding child care on autopilot.
              </p>
            </div>

            <div className="space-y-20 md:space-y-32 relative">
              {/* Connecting subtle vertical line in the background for desktop */}
              <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10 -translate-x-1/2 rounded-full -z-10" />

              {steps.map((step, index) => {
                const isEven = index % 2 === 0;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.7, type: "spring", bounce: 0.2 }}
                    className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${isEven ? "" : "md:flex-row-reverse"}`}
                  >
                    <div className={`w-full md:w-1/2 flex justify-center ${isEven ? "md:justify-end" : "md:justify-start"}`}>
                      <div className={`relative w-48 h-48 md:w-64 md:h-64 rounded-3xl flex items-center justify-center shadow-xl border border-white/20 backdrop-blur-sm ${step.color} rotate-3 hover:rotate-0 transition-transform duration-500`}>
                        <div className="absolute inset-0 bg-white/40 dark:bg-black/20 rounded-3xl mix-blend-overlay"></div>
                        <step.icon className="w-20 h-20 md:w-28 md:h-28 relative z-10" />
                      </div>
                    </div>

                    <div className={`w-full md:w-1/2 space-y-5 text-center ${isEven ? "md:text-left" : "md:text-right"}`}>
                      <div className={`inline-flex items-center rounded-full border border-border/60 px-4 py-1.5 text-sm font-bold bg-background shadow-sm text-foreground/70 ${isEven ? "" : "md:ml-auto"}`}>
                        Step {index + 1}
                      </div>
                      <h3 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                        {step.title.replace(/^\d+\.\s*/, '')}
                      </h3>
                      <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="py-20 md:py-28 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-6 max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
                Trusted by BC Parents
              </h2>
              <p className="text-lg text-muted-foreground font-medium">
                Real families who found care faster with AutoDayCare BC.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {[
                {
                  quote: "I spent months calling daycares with no luck. Within 48 hours of using AutoDayCareBC, I had three viewings lined up in Coquitlam. The auto-outreach is a game-changer.",
                  author: "Sarah L.",
                  role: "Working Mom",
                  initials: "SL",
                  color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
                },
                {
                  quote: "The phone tag nightmare is real. This tool did the heavy lifting for us. We secured a verified spot for our toddler just in time for my return to work.",
                  author: "Michael Chen",
                  role: "Burnaby",
                  initials: "MC",
                  color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
                },
                {
                  quote: "Finally, a map that actually makes sense. Seeing which providers are active versus just a phone number from a government list saved us so much time.",
                  author: "The Patel Family",
                  role: "Vancouver",
                  initials: "PF",
                  color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
                },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="bg-background rounded-2xl border border-border/60 p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <Quote className="h-8 w-8 text-primary/20 mb-4 flex-shrink-0" />
                    <p className="text-foreground/80 leading-relaxed mb-6 flex-1 text-[15px]">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/40">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold ${t.color}`}>
                        {t.initials}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{t.author}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="py-24 md:py-36 relative overflow-hidden bg-background">
          <div className="container mx-auto px-6 max-w-3xl text-center flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="relative z-10 w-full"
            >
              <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 text-foreground">
                Ready to find your child&apos;s spot without the stress?
              </h2>
              <p className="text-xl text-muted-foreground mb-10 font-medium">
                Join hundreds of parents skipping the waitlist phone tag.
              </p>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button size="lg" className="text-lg h-16 w-full sm:w-auto px-12 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    Start Auto-Search
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button size="lg" className="text-lg h-16 w-full sm:w-auto px-12 rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all" asChild>
                  <Link href="/dashboard">
                    Start Auto-Search
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </Link>
                </Button>
              </SignedIn>
            </motion.div>

            {/* Glow effect behind CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 mix-blend-multiply blur-[120px] rounded-full pointer-events-none -z-10" />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-border mt-auto bg-card/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            © {new Date().getFullYear()} AutoDayCare BC. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
