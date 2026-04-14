import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Nainix',
  description: 'Terms of Service for Nainix Marketplace',
};

const TermsOfService = () => {
  return (
    <div className="container max-w-4xl py-12 md:py-16">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Nainix (nainix.me), you agree to comply with and be bound by these Terms of Service. If you do not agree with these terms, please do not use the platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. The Tiered Commission Model & Platform Role</h2>
            <p>
              Nainix operates on a <strong>tiered commission model</strong> (ranging from 10% to 1% depending on your chosen plan). Our core service is connecting clients with tech talent. 
              <strong> We do not hold escrow or mediate payment disputes between parties.</strong> Users are responsible for their own financial transactions and agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Conduct</h2>
            <p>
              You agree to use Nainix for lawful purposes only. You must not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-2">
              <li>Post fraudulent, spam, or misleading job listings.</li>
              <li>Harass, abuse, or harm other users.</li>
              <li>Create multiple fake accounts to manipulate platform rankings.</li>
            </ul>
            <p className="mt-2">We reserve the right to suspend or ban accounts that violate these rules.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Intellectual Property</h2>
            <p>
              Users retain all ownership of the content they post (proposals, job descriptions, portfolios). By posting on Nainix, you grant us a license to display this content on our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Limitation of Liability</h2>
            <p>
              Nainix shall not be liable for any indirect, incidental, or consequential damages resulting from your use of the platform, including unpaid invoices or project delays between users.
            </p>
          </section>
        </div>

        <div className="pt-8">
          <Link href="/" className="text-primary hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;