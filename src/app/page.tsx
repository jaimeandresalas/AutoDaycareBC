import { Button } from "@/components/ui/button";
import { Search, MapPin, Send, CheckCircle, Menu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-2 rounded-xl shadow-sm">
              <Search className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-primary">AutoDayCare BC</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-[15px] text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Search</a>
            <a href="#" className="hover:text-primary transition-colors">For Providers</a>
            <a href="#" className="hover:text-primary transition-colors">Login</a>
            <Button size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all font-semibold px-6">
              Find Care Now
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
        <section className="relative px-6 pt-24 pb-32 md:pt-36 md:pb-48 overflow-hidden">
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
            <div className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
              <Button size="lg" className="text-lg h-16 w-full sm:w-auto px-10 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                Start Auto-Search
                <Search className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg h-16 w-full sm:w-auto px-10 rounded-full bg-background/50 hover:bg-muted/50 border-border/60 transition-colors">
                How it works
              </Button>
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
        <section className="py-24 bg-gradient-to-b from-transparent to-card/50 border-t border-border/30 relative">
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
