import { motion } from 'framer-motion';
import Link from 'next/link';

const AnimatedLogo = () => {
  return (
    <Link href="/" className="flex items-center select-none group" aria-label="Nainix Home">
      {/* Wordmark — Neoda font, animates on entry */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        className="relative flex items-center"
      >
        <span className="logo-font text-2xl font-normal tracking-wide text-foreground transition-colors duration-300 group-hover:text-primary">
          Nainix
        </span>
      </motion.div>
    </Link>
  );
};

export default AnimatedLogo;
