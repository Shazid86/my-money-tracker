"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Brain,
  CircleDollarSign,
  Code2,
  Lightbulb,
  Target,
  TrendingUp,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
      {/* ============================================================
          NAVIGATION
      ============================================================ */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="group flex items-center gap-2 text-sm font-black text-slate-700 transition hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

            Back to Aureus
          </Link>

          <Link
            href="/"
            className="text-xl font-black tracking-tight text-slate-950 dark:text-white"
          >
            AUREUS
          </Link>
        </div>
      </header>

      {/* ============================================================
          HERO
      ============================================================ */}

      <section className="relative overflow-hidden">
        {/* Background decoration */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-180px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-emerald-400/10 blur-3xl dark:bg-emerald-500/10" />

          <div className="absolute bottom-[-150px] right-[-100px] h-[400px] w-[400px] rounded-full bg-emerald-300/10 blur-3xl dark:bg-emerald-500/5" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">
              <Lightbulb className="h-3.5 w-3.5" />

              The Story Behind Aureus
            </div>

            <h1 className="mt-7 text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Built from a personal
              <span className="block text-emerald-500">
                financial problem.
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">
              Aureus began with a simple realization: money doesn't always
              disappear because of one huge mistake. Sometimes it disappears
              through hundreds of small decisions that barely feel important
              at the moment.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOUNDER
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl shadow-slate-200/40 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/20">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
            {/* PHOTO SIDE */}

            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-slate-950 p-10">
              {/* Decorative circles */}

              <div className="absolute h-[320px] w-[320px] rounded-full border border-white/10" />

              <div className="absolute h-[420px] w-[420px] rounded-full border border-white/5" />

              <div className="absolute h-[520px] w-[520px] rounded-full border border-emerald-500/10" />

              {/* PHOTO CONTAINER */}

              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-emerald-500/20 blur-2xl" />

                <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-emerald-400 to-emerald-700 p-2 shadow-2xl shadow-emerald-950/50 sm:h-72 sm:w-72">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-900">
                    <img
                      src="/Founder image - 2.jpg" /* PLACE YOUR PHOTO IN public/founder.jpg AND UPDATE FILENAME IF NEEDED */
                      alt="Shazedur Rahman"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

                {/* Floating badge */}

                <div className="absolute -right-5 bottom-5 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-xl">
                  <p className="text-xs font-bold text-slate-400">
                    Building
                  </p>

                  <p className="mt-1 text-sm font-black text-white">
                    Aureus
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT SIDE */}

            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                The Founder
              </p>

              <h2 className="mt-4 text-5xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl">
                Shazedur Rahman
              </h2>

              <p className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                Founder · Developer · CEO
              </p>

              <p className="mt-8 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
                I'm the person behind Aureus. As a developer and someone who
                constantly thinks about building better systems, I wanted to
                create something that could solve a problem I was personally
                experiencing.
              </p>

              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-400">
                This project isn't built around pretending to have everything
                figured out. It's built around learning, tracking mistakes,
                improving decisions, and becoming more intentional over time.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Developer
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Builder
                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Problem Solver
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          MY STORY
      ============================================================ */}

      <section className="border-y border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
              <CircleDollarSign className="h-6 w-6" />
            </div>

            <h2 className="mt-6 text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
              Why I built Aureus.

              <div className="relative flex h-64 w-64 mt-4 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-br from-emerald-400 to-emerald-700 p-2 shadow-2xl shadow-emerald-950/50 sm:h-72 sm:w-72">
                  <div className="relative h-full w-full overflow-hidden rounded-full bg-slate-900">
                    <img
                      src="/Aureus.png" /* PLACE YOUR PHOTO IN public/founder.jpg AND UPDATE FILENAME IF NEEDED */
                      alt="brand logo"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>

            </h2>
          </div>

          <div className="space-y-6 text-base leading-8 text-slate-600 dark:text-slate-400">
            <p>
              I started noticing something uncomfortable about my own spending.
              I wasn't necessarily making massive purchases. Instead, money
              was quietly disappearing through small and unnecessary expenses.
            </p>

            <p>
              Junk food. Fast food. Random purchases. Things that felt small
              individually but became significant when added together over
              weeks and months.
            </p>

            <p className="font-medium text-slate-800 dark:text-slate-200">
              The frustrating part wasn't simply spending money. It was not
              fully understanding where it was going.
            </p>

            <p>
              So instead of continuing to complain about the problem, I decided
              to build something that would force me to see it clearly.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT AUREUS DOES
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            The Purpose
          </p>

          <h2 className="mt-5 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Awareness before improvement.
          </h2>

          <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-400">
            Aureus is designed around one simple principle: you cannot improve
            financial behavior if you don't understand it first.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>

            <h3 className="mt-6 text-lg font-black text-slate-950 dark:text-white">
              Track Spending
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Record purchases clearly so even the smallest expenses don't
              quietly disappear from your awareness.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400">
              <Brain className="h-6 w-6" />
            </div>

            <h3 className="mt-6 text-lg font-black text-slate-950 dark:text-white">
              Understand Patterns
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              See where money is actually going and identify habits that might
              need attention.
            </p>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Target className="h-6 w-6" />
            </div>

            <h3 className="mt-6 text-lg font-black text-slate-950 dark:text-white">
              Improve Decisions
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">
              Use real data about your behavior to gradually make more
              intentional financial decisions.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FUTURE
      ============================================================ */}

      <section className="bg-slate-950 py-20 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-400">
              Looking Forward
            </p>

            <h2 className="mt-5 max-w-2xl text-4xl font-black tracking-tight sm:text-5xl">
              Today it's personal.
              <br />
              Tomorrow, maybe bigger.
            </h2>

            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400">
              Aureus is currently a personal project and an experiment in
              building better financial discipline. I'm using it, testing it,
              and learning from the results.
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
              If the system proves genuinely useful, the future could involve
              deeper market research, experimentation, and development into
              something that helps more people understand and improve their
              financial behavior.
            </p>
          </div>

          <div className="flex items-center">
            <div className="w-full rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
              <Code2 className="h-8 w-8 text-emerald-400" />

              <p className="mt-6 text-lg font-black">
                Build. Test. Learn. Improve.
              </p>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                The future isn't something I want to blindly imagine. I want
                the results of today's work to determine what Aureus becomes
                tomorrow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CTA
      ============================================================ */}

      <section className="mx-auto max-w-7xl px-5 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white sm:text-4xl">
          Small decisions build bigger results.
        </h2>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-500 dark:text-slate-400">
          Aureus exists to make those small decisions visible.
        </p>

        <Link
          href="/"
          className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5 hover:bg-emerald-600"
        >
          Explore Aureus

          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Link>
      </section>
    </main>
  );
}