import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import BottomNav from './BottomNav';

export default function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:max-w-md md:mx-auto md:border-x md:border-border shadow-2xl relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18, ease: "easeInOut" }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
}
