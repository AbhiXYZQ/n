import Link from 'next/link';

export const metadata = {
  title: 'Refund Policy | Nainix',
  description: 'Refund Policy for Nainix Marketplace',
};

const RefundPolicy = () => {
  return (
    <div className="container max-w-4xl py-12 md:py-16">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Refund Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Project Payments</h2>
            <p>
              Nainix operates on a strict <strong>0% commission</strong> model. We act exclusively as a connection hub and <strong>do not process, hold, or manage any project-related payments</strong> between Clients and Freelancers. 
            </p>
            <p className="mt-2">
              Therefore, Nainix cannot issue refunds for any freelance work, milestones, or projects. Any disputes regarding payments or refunds must be resolved directly between the Client and the Freelancer according to their mutual external agreements.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. Platform Support & "Tip Jar"</h2>
            <p>
              To keep the platform free and 0% commission for everyone, Nainix accepts voluntary financial support via our "Tip Jar" or sponsorship links. 
              Because these are voluntary contributions to support server and development costs, <strong>all tips and sponsorships are final and non-refundable</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Questions</h2>
            <p>
              If you have questions about how billing and payments should be handled externally, we recommend using secure third-party platforms (like Razorpay, Stripe, or direct bank transfers) and drafting clear freelance contracts before starting work.
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

export default RefundPolicy;