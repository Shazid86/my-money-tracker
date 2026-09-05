import Link from "next/link";

import {
  ArrowUpRight,
  Heart,
  Mail,
  Sparkles,
} from "lucide-react";

import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      {/* Background decoration */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />

        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-8 lg:px-10">
        {/* MAIN FOOTER */}

        <div className="grid gap-12 lg:grid-cols-[1.5fr_0.8fr_0.8fr_1fr]">
          {/* BRAND */}

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-3"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-lg font-black text-white shadow-lg shadow-emerald-500/20">
                A
              </div>

              <div>
                <span className="block text-xl font-black tracking-tight text-slate-950 dark:text-white">
                  Aureus
                </span>

                <span className="text-xs font-medium text-slate-400">
                  Personal Finance Tracker
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-slate-500 dark:text-slate-400">
              Aureus helps you understand where your money actually goes —
              one transaction at a time.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-400">
              <Sparkles className="h-3.5 w-3.5" />

              Built for better financial discipline
            </div>
          </div>

          {/* NAVIGATION */}

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900 dark:text-white">
              Navigation
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-sm font-medium text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm font-medium text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* PRODUCT */}

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900 dark:text-white">
              Aureus
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/#dashboard"
                  className="text-sm font-medium text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  href="/#transactions"
                  className="text-sm font-medium text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Transactions
                </Link>
              </li>

              <li>
                <Link
                  href="/#report"
                  className="text-sm font-medium text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                >
                  Monthly Report
                </Link>
              </li>
            </ul>
          </div>

          {/* CONNECT */}

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.16em] text-slate-900 dark:text-white">
              Connect
            </h3>

            <p className="mt-5 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Follow the journey and explore the work behind Aureus.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {/* EMAIL */}

              <a
                href="mailto:seekinginnerpeace1010@gmail.com"
                aria-label="Email"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400"
              >
                <Mail className="h-4 w-4" />
              </a>

              {/* FACEBOOK */}

              <a
                href="https://www.facebook.com/shazedur.rahman.86"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-900 dark:hover:bg-blue-950/30"
              >
                <FaFacebookF className="h-4 w-4" />
              </a>

              {/* INSTAGRAM */}

              <a
                href="https://instagram.com/the_shazedur"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-1 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-pink-900 dark:hover:bg-pink-950/30"
              >
                <FaInstagram className="h-4 w-4" />
              </a>

              {/* LINKEDIN */}

              <a
                href="www.linkedin.com/in/shazedur-rahman-ba336a329"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-900 dark:hover:bg-blue-950/30"
              >
                <FaLinkedin className="h-4 w-4" />
              </a>

              {/* GITHUB */}

              <a
                href="https://github.com/Shazid86"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:-translate-y-1 hover:border-slate-400 hover:text-slate-950 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-slate-600 dark:hover:text-white"
              >
                <FaGithub className="h-4 w-4" />
              </a>
            </div>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-black text-emerald-600 transition hover:gap-3 dark:text-emerald-400"
            >
              Get in touch

              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* DIVIDER */}

        <div className="my-10 h-px bg-slate-200 dark:bg-slate-800" />

        {/* BOTTOM BAR */}

        <div className="flex flex-col gap-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-500 dark:text-slate-400">
            <span>
              © {currentYear} Aureus.
            </span>

            <span className="hidden sm:inline">
              •
            </span>

            <span>
              Built independently by Shazid.
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <span>
              Built with
            </span>

            <Heart className="h-4 w-4 fill-emerald-500 text-emerald-500" />

            <span>
              and discipline.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}