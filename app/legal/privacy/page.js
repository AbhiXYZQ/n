import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Nainix',
  description: 'Privacy Policy for Nainix Marketplace',
};

const PrivacyPolicy = () => {
  return (
    <div className="container max-w-4xl py-12 md:py-16">
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2026</p>

        <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
            <p>
              Welcome to Nainix. We collect information you provide directly to us when creating an account, such as your name, email address, GitHub/LinkedIn profile links, and portfolio details. We also collect data related to your job postings and proposals to facilitate connections.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">2. How We Use Your Information</h2>
            <p>
              We use the information to operate, maintain, and improve our platform. Specifically, your profile information is used to match freelancers with clients. We <strong>do not sell</strong> your personal data to third-party data brokers. Nainix is built for developers, and we respect your privacy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">3. Third-Party Authentication</h2>
            <p>
              If you choose to log in via Google or GitHub, we receive basic profile information (like your name and email) from these providers. We use this strictly for authentication and account creation on nainix.me.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your account. However, remember that no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mt-8 mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our official social media channels or at legal@nainix.me.
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

export default PrivacyPolicy;