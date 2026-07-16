'use client';

import React from 'react';
import MainLayout from '../../components/MainLayout';
import { BookOpen, Users, Shield, Target, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const stats = [
    { label: 'Study Rooms', value: '150+' },
    { label: 'Active Users', value: '5,000+' },
    { label: 'Hours Booked', value: '25k+' },
    { label: 'Campuses Covered', value: '12+' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To provide students with distraction-free environments that foster productivity, collaboration, and academic excellence.',
    },
    {
      icon: Shield,
      title: 'Secure & Verified',
      description: 'Every listing undergoes validation. Rest easy knowing your study spaces are safe, well-equipped, and exactly as described.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Built by students, for students. We make sharing and finding resources within the campus ecosystem seamless and rewarding.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <MainLayout title="About Us">
      <div className="relative overflow-hidden py-12">
        {/* Background decorative gradient blurs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          className="max-w-5xl mx-auto space-y-16 relative"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          
          {/* Header section */}
          <motion.div className="text-center space-y-4" variants={itemVariants}>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-550/20">
              <GraduationCap className="w-3.5 h-3.5" /> About StudyNook
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
              Empowering Students to{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Focus & Achieve
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
              StudyNook is a decentralized platform designed to streamline study room discovery, list-sharing, and reservation management. We help university students find quiet spaces in libraries, academic halls, and campus centers.
            </p>
          </motion.div>

          {/* Stats section */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6" 
            variants={itemVariants}
          >
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 text-center backdrop-blur-sm"
                whileHover={{ scale: 1.05, borderColor: 'rgba(99, 102, 241, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <p className="text-3xl sm:text-4xl font-extrabold text-white bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{stat.value}</p>
                <p className="text-sm font-medium text-slate-400 mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Core Values grid */}
          <motion.div className="space-y-8" variants={itemVariants}>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
              Why Choose StudyNook?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <motion.div 
                    key={idx} 
                    className="bg-slate-900/40 border border-slate-800/60 transition-all duration-300 rounded-2xl p-6 flex flex-col space-y-4"
                    whileHover={{ y: -6, borderColor: 'rgba(99, 102, 241, 0.3)', backgroundColor: 'rgba(15, 23, 42, 0.8)' }}
                  >
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-xl w-fit text-indigo-400">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">{val.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{val.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Call to action card */}
          <motion.div 
            className="bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-950/40 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8"
            variants={itemVariants}
            whileHover={{ boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.15)' }}
          >
            <div className="space-y-3 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white">Ready to boost your study game?</h3>
              <p className="text-sm text-slate-300 max-w-md">Find the perfect location, configure the ideal timeframe, and get straight to studying.</p>
            </div>
            <div className="flex gap-4">
              <motion.a 
                href="/rooms" 
                className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 transition-all duration-200 text-sm block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Rooms
              </motion.a>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </MainLayout>
  );
}
