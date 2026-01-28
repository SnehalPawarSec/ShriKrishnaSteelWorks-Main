import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { ArrowRight, ShieldCheck, Users, Award, MoveRight, CheckCircle2 } from 'lucide-react';
import ChatBot from '@/components/ChatBot';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  // Fetch logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const featuredProducts = [
    {
      name: 'Structural Steel Beams',
      description: 'Heavy-duty steel beams for construction and infrastructure projects.',
      image: '/photos/steel beems.jpg',
      category: 'Structural',
      price: '₹450/kg'
    },
    {
      name: 'Custom Steel Gates',
      description: 'Elegant security gates designed to your specifications.',
      image: '/photos/WhatsApp Image 2025-09-02 at 23.30.03_083a883e.jpg',
      category: 'Custom',
      price: 'Quote on Request'
    },
    {
      name: 'Industrial Platforms',
      description: 'Heavy-duty platforms and mezzanine structures for industrial use.',
      image: '/photos/WhatsApp Image 2025-09-02 at 23.38.52_4a38bb6a.jpg',
      category: 'Industrial',
      price: '₹380/sq ft'
    }
  ];

  // Animation Variants with explicit Framer Motion types to fix TS2322
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <Hero />

      {/* ================= WELCOME / PROCEED ================= */}
      <AnimatePresence>
        {user && (
          <section className="max-w-4xl mx-auto px-4 -mt-32 relative z-30">
            <motion.div 
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: "circOut" }}
              className="bg-white/90 backdrop-blur-2xl border border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[2rem] p-8 md:p-12 text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Secure Session Active</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-slate-900">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">{user.displayName}</span>
              </h2>
              <p className="text-slate-500 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
                Your fabrication dashboard is ready. Access your saved addresses and track your ongoing steel works.
              </p>
              <Button
                size="lg"
                className="hero-gradient px-12 py-7 text-lg font-bold rounded-full shadow-xl hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95 group"
                onClick={() => navigate('/address')}
              >
                Proceed to Dashboard
                <MoveRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </section>
        )}
      </AnimatePresence>

      {/* ================= TRUST METRICS ================= */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
             style={{ backgroundImage: `radial-gradient(#000 1px, transparent 1px)`, backgroundSize: '32px 32px' }}></div>
        
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8 relative z-10"
        >
          {[
            { icon: ShieldCheck, val: "72+", label: "Projects Completed" },
            { icon: Users, val: "50+", label: "Happy Clients" },
            { icon: Award, val: "15+", label: "Years Experience" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              variants={fadeInUp}
              className="group bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-primary/20 transition-all duration-500 rounded-3xl p-10 text-center"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <stat.icon className="h-8 w-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-5xl font-black tracking-tighter mb-2 text-slate-900">{stat.val}</h3>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8"
          >
            <div className="max-w-2xl">
              <Badge variant="outline" className="mb-4 px-4 py-1.5 border-primary/20 text-primary bg-primary/5 font-bold uppercase tracking-widest text-[10px]">
                Quality Assured
              </Badge>
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
                Steel Solutions
              </h2>
              <p className="text-xl text-slate-500 leading-relaxed">
                Precision-engineered components built to withstand the toughest industrial environments.
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              className="group border-2 border-slate-900 hover:bg-slate-900 hover:text-white rounded-full px-8 transition-all font-bold"
              onClick={() => navigate('/products')}
            >
              Browse Catalog
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-10 mb-16"
          >
            {featuredProducts.map((product, index) => (
              <motion.div key={index} variants={fadeInUp} className="h-full">
                <div className="h-full hover:shadow-2xl transition-shadow duration-500 rounded-3xl overflow-hidden">
                  <ProductCard {...product} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="pb-32 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto overflow-hidden rounded-[3rem] shadow-2xl relative"
        >
          <div className="peacock-gradient p-12 md:p-24 text-white text-center relative z-10 border border-white/10">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
              Ready to start your <br /> next big project?
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-80 max-w-3xl mx-auto leading-relaxed font-medium">
              Join 50+ clients who trust Shri Krishna Steel Works for precision fabrication and timely delivery.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button 
                size="lg" 
                variant="secondary" 
                className="h-16 px-10 text-lg font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                onClick={() => navigate('/projects')}
              >
                View Project Gallery
              </Button>
              <Button 
                size="lg" 
                className="h-16 px-10 text-lg font-bold bg-white text-primary hover:bg-slate-50 rounded-full shadow-lg hover:scale-105 transition-transform"
                onClick={() => navigate('/contact')}
              >
                Request Custom Quote
              </Button>
            </div>
          </div>

          {/* Abstract Glass Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-bottom pointer-events-none"></div>
        </motion.div>
      </section>

      {/* ================= CHATBOT ================= */}
      <ChatBot />
    </Layout>
  );
};

export default Index;