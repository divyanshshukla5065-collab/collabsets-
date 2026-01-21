
import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose dark:prose-invert">
      <h1 className="text-4xl font-black mb-8">Terms & Conditions</h1>
      <p className="text-slate-500 font-medium">Last updated: May 20, 2024</p>
      
      <section className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">1. Platform Overview</h2>
        <p>COLLABSET acts as a marketplace facilitator between Brands and Influencers. We are not responsible for the content created or the ultimate performance of marketing campaigns.</p>

        <h2 className="text-2xl font-bold">2. Data Disclaimer</h2>
        <p>All creator metrics (followers, views, etc.) are provided either by the creator or via public API endpoints. COLLABSET provides no absolute guarantee of the accuracy of these metrics.</p>

        <h2 className="text-2xl font-bold">3. Payments</h2>
        <p>All payments are handled in INR (₹). Users are responsible for their own tax obligations as per Indian law. COLLABSET platform fees are non-refundable once a collaboration is accepted.</p>

        <h2 className="text-2xl font-bold">4. Content Ownership</h2>
        <p>By default, brands own the usage rights for content created during a collaboration, unless specified otherwise in the individual collab agreement.</p>
      </section>

      <h1 className="text-4xl font-black mt-20 mb-8">Privacy Policy</h1>
      <section className="space-y-6">
        <p>We respect your privacy. We collect data necessary for profile verification including social media handles and email addresses. We never sell your personal contact information to third parties.</p>
      </section>
    </div>
  );
};
