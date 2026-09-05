"use client";
import { FaInstagram } from "react-icons/fa";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Mail,
  Phone,
  Send,
  Sparkles,
  Globe,
} from "lucide-react";

import {
  FaFacebookF,
  FaGithub,
  FaLinkedinIn,
} from "react-icons/fa6";

export default function ContactPage() {
  const contactMethods = [
    {
      title: "Email",
      description:
        "For professional inquiries, collaborations, ideas, or anything related to Aureus.",
      value: "seekinginnerpeace1010@gmail.com",
      href: "mailto:seekinginnerpeace1010@gmail.com",
      type: "email",
      accent:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },

    {
      title: "Phone",
      description:
        "Reach me directly for important conversations or professional communication.",
      value: "+8801751577883",
      href: "tel:+8801751577883",
      type: "phone",
      accent:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },

    {
      title: "Facebook",
      description:
        "Connect with me through Facebook and follow my personal journey.",
      value: "Facebook Profile",
      href: "https://facebook.com/shazedur.rahman.86",
      type: "facebook",
      accent:
        "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
    },

    {
        title: "Instagram",
        description:
          "Connect with me through Instagram and follow my personal journey.",
        value: "Instagram Profile",
        href: "https://instagram.com/the_shazedur",
        type: "instagram",
        accent:
          "bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400",
      },

    {
      title: "LinkedIn",
      description:
        "Professional connections, career development, and future opportunities.",
      value: "LinkedIn Profile",
      href: "https://linkedin.com/in/shazedur-rahman-ba336a329",
      type: "linkedin",
      accent:
        "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
    },

    {
      title: "GitHub",
      description:
        "Explore my development work, projects, experiments, and future builds.",
      value: "GitHub Profile",
      href: "https://github.com/Shazid86",
      type: "github",
      accent:
        "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    },
  ];

  const renderIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-5 w-5" />;

      case "phone":
        return <Phone className="h-5 w-5" />;

      case "facebook":
        return <FaFacebookF className="h-5 w-5" />;

      case "linkedin":
        return <FaLinkedinIn className="h-5 w-5" />;

      case "github":
        return <FaGithub className="h-5 w-5" />;

      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-white">

      {/* ================= HEADER ================= */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-slate-50/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">

          <Link
            href="/"
            className="group flex items-center gap-3"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-black text-white shadow-lg shadow-emerald-500/20 transition group-hover:scale-105">
              A
            </div>

            <div>

              <p className="text-lg font-black tracking-tight text-slate-950 dark:text-white">
                Aureus
              </p>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">
                Money Intelligence
              </p>

            </div>

          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400"
          >

            <ArrowLeft className="h-4 w-4" />

            <span className="hidden sm:inline">
              Back to Dashboard
            </span>

            <span className="sm:hidden">
              Back
            </span>

          </Link>

        </div>

      </header>


      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute left-[-10%] top-[-20%] h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="absolute right-[-10%] top-[10%] h-80 w-80 rounded-full bg-slate-400/10 blur-3xl" />

        </div>


        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">

          <div className="max-w-3xl">

            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400">

              <Sparkles className="h-3.5 w-3.5" />

              Let's Connect

            </div>


            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl lg:text-6xl">

              Let's build something

              <span className="block text-emerald-500">
                meaningful.
              </span>

            </h1>


            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-400 sm:text-lg">

              Whether you want to discuss Aureus, technology,
              business ideas, development, collaboration, or just
              have something interesting to share — feel free to
              reach out.

            </p>

          </div>

        </div>

      </section>


      {/* ================= CONTACT CARDS ================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {contactMethods.map((contact) => (

            <a
              key={contact.title}
              href={contact.href}
              target={
                contact.href.startsWith("http")
                  ? "_blank"
                  : undefined
              }
              rel={
                contact.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
              className="group rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/60 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-900 dark:hover:shadow-black/30"
            >

              <div className="flex items-start justify-between gap-4">

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl ${contact.accent}`}
                >

                  {renderIcon(contact.type)}

                </div>


                <ArrowUpRight className="h-5 w-5 text-slate-300 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-emerald-500 dark:text-slate-600" />

              </div>


              <h2 className="mt-6 text-lg font-black tracking-tight text-slate-950 dark:text-white">
                {contact.title}
              </h2>


              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {contact.description}
              </p>


              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">

                <span className="text-sm font-bold text-emerald-600 transition group-hover:text-emerald-500 dark:text-emerald-400">
                  {contact.value}
                </span>

              </div>

            </a>

          ))}

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-10 shadow-2xl shadow-slate-300/40 dark:bg-slate-900 dark:shadow-black/40 sm:px-10 sm:py-14">

          <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />


          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

            <div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-950/40">

                <Send className="h-5 w-5" />

              </div>


              <h2 className="mt-6 text-2xl font-black tracking-tight text-white sm:text-3xl">
                Have an idea worth discussing?
              </h2>


              <p className="mt-3 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">

                I'm always interested in meaningful conversations,
                useful ideas, technology, business opportunities,
                and projects that can create real value.

              </p>

            </div>


            <a
              href="mailto:your-email@example.com"
              className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-sm font-black text-white shadow-lg shadow-emerald-950/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >

              <Mail className="h-4 w-4" />

              Send Me an Email

              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

            </a>

          </div>

        </div>

      </section>

      {/* ================= FOOTER ================= */}

      <footer className="bg-slate-50 py-8 dark:bg-slate-950">

        


          

        

      </footer>

    </main>
  );
}