
import React from 'react';
import { Mail, Shield, Scale, Info, Eye, Database, Lock, UserCheck, FileText, Heart, Handshake, Rocket, ArrowRight, RotateCcw, AlertTriangle } from 'lucide-react';
// Fix: Verified named exports from react-router-dom
import { Link } from 'react-router-dom';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      {/* Header Section */}
      <div className="mb-12 border-b border-slate-100 dark:border-slate-800 pb-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-950 dark:text-white mb-4 flex items-center gap-4">
          <FileText className="w-10 h-10 text-purple-600" /> Legal Center
        </h1>
        <p className="text-slate-700 dark:text-slate-400 font-bold flex items-center gap-2">
          <span className="flex items-center gap-2">
            <Info className="w-4 h-4 text-purple-600" /> 
            Last updated: January 2024
          </span>
        </p>
      </div>
      
      <div className="space-y-16">
        {/* --- TERMS & CONDITIONS SECTION --- */}
        <div id="terms" className="space-y-10">
          <div className="flex items-center gap-4">
             <div className="h-1 w-12 bg-purple-600 rounded-full" />
             <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Terms & Conditions</h2>
          </div>

          <section>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-4 flex items-center gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 text-sm font-black">1</span>
              About Collabset
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl space-y-4 text-slate-800 dark:text-slate-300 font-medium leading-relaxed border border-slate-100 dark:border-slate-800 shadow-sm">
              <p>Collabset is a digital platform owned and operated by <strong>Shalini Shukla</strong> (Director & Proprietor).</p>
              <p>Collabset provides AI-powered suggestions, tools, and insights related to creator growth, collaborations, and digital decision-making.</p>
              <p>Currently, Collabset is not registered as a private limited company.</p>
              <div className="pt-4 space-y-2 border-t border-slate-200 dark:border-slate-700">
                <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Contact Identity:</p>
                <div className="flex flex-col gap-2">
                  <a href="mailto:collabsets.in@gmail.com" className="flex items-center gap-2 text-purple-600 hover:underline font-bold">
                    <Mail className="w-4 h-4" /> collabsets.in@gmail.com
                  </a>
                  <a href="mailto:divyanshshukla5064@gmail.com" className="flex items-center gap-2 text-purple-600 hover:underline font-bold">
                    <Mail className="w-4 h-4" /> divyanshshukla5064@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-xl font-black text-slate-950 dark:text-white mb-4 flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-600" /> 2. Eligibility
              </h2>
              <p className="text-slate-800 dark:text-slate-400 font-medium leading-relaxed">
                You must be at least 16 years old to use Collabset. By using our platform, you confirm that the information you provide is accurate and lawful.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-950 dark:text-white mb-4 flex items-center gap-3">
                <Scale className="w-5 h-5 text-purple-600" /> 3. User Accounts
              </h2>
              <p className="text-slate-800 dark:text-slate-400 font-medium leading-relaxed">
                Users can sign up using email/password or Google login. You are responsible for maintaining the confidentiality of your account. Collabset reserves the right to suspend or terminate accounts involved in abuse or violation of these terms.
              </p>
            </section>
          </div>
        </div>

        {/* --- REFUND & RETURN POLICY SECTION --- */}
        <div id="refund" className="space-y-10">
          <div className="flex items-center gap-4">
             <div className="h-1 w-12 bg-amber-500 rounded-full" />
             <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Refund & Return Policy</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-green-50 dark:bg-green-900/10 p-8 rounded-3xl border border-green-100 dark:border-green-900/30">
              <h2 className="text-xl font-black text-slate-950 dark:text-white mb-4 flex items-center gap-3">
                <RotateCcw className="text-green-600" /> Platform Errors
              </h2>
              <p className="text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
                If a technical mistake or processing error is made from <strong>our side</strong> (Collabset platform), we provide a <strong>full refund</strong> of the transaction amount involved.
              </p>
            </section>

            <section className="bg-blue-50 dark:bg-blue-900/10 p-8 rounded-3xl border border-blue-100 dark:border-blue-900/30">
              <h2 className="text-xl font-black text-slate-950 dark:text-white mb-4 flex items-center gap-3">
                <Handshake className="text-blue-600" /> Project Non-Fulfillment
              </h2>
              <p className="text-slate-800 dark:text-slate-300 font-medium leading-relaxed">
                In cases where a scheduled project was <strong>not completed</strong> or deliverables were not provided as per the agreement, we issue a <strong>full refund/payment reversal</strong> to the affected party.
              </p>
            </section>
          </div>

          <section className="bg-red-50 dark:bg-red-950/20 p-8 rounded-[32px] border border-red-100 dark:border-red-900/30">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/40 rounded-2xl text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-3 uppercase tracking-tighter">Quality Exclusion</h2>
                <p className="text-slate-800 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                  Please note: We <strong>do not</strong> offer refunds or returns based on subjective <strong>quality assessments</strong>. Once a project is completed according to the agreed-upon brief, dissatisfaction with the creative style or subjective output is not grounds for a refund.
                </p>
              </div>
            </div>
          </section>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl text-center">
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Need to raise a dispute?</p>
            <p className="text-sm text-slate-700 dark:text-slate-400 font-bold">
              Contact our legal desk at <a href="mailto:collabsets.in@gmail.com" className="text-purple-600 hover:underline">collabsets.in@gmail.com</a> for a review of your case.
            </p>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:border-slate-800 w-full" />
        
        {/* --- PRIVACY POLICY SECTION --- */}
        <div id="privacy" className="space-y-10">
          <div className="flex items-center gap-4">
             <div className="h-1 w-12 bg-purple-600 rounded-full" />
             <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Privacy Policy</h2>
          </div>
          <section className="space-y-4">
             <p className="text-slate-800 dark:text-slate-500 font-bold leading-relaxed">
              We prioritize your data privacy. Collabset, under the direction of Shalini Shukla, is committed to safeguarding all personal information collected through our secure infrastructure.
             </p>
          </section>
        </div>
      </div>
    </div>
  );
};
