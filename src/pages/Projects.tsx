
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Building, CheckCircle, ArrowUpRight, TrendingUp, X } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const ongoingProjects = [
    {
      id: 1,
      name: 'Mumbai Commercial Complex',
      location: 'Mumbai, Maharashtra',
      city: 'Mumbai',
      progress: 75,
      startDate: 'Jan 2024',
      expectedCompletion: 'Mar 2024',
      type: 'Commercial',
      client: 'Reliance Industries Ltd.',
      coordinates: [19.0760, 72.8777],
      budget: { total: 5000000, spent: 3750000, remaining: 1250000, pending: 500000 },
      materials: [
        { name: 'Steel Beams (I-Section)', quantity: '50 tons', cost: 2500000, supplier: 'Tata Steel', status: 'delivered' },
        { name: 'Reinforcement Bars', quantity: '25 tons', cost: 1000000, supplier: 'JSW Steel', status: 'delivered' },
        { name: 'Steel Plates', quantity: '15 tons', cost: 750000, supplier: 'SAIL', status: 'pending' },
        { name: 'Welding Electrodes', quantity: '200 kg', cost: 50000, supplier: 'ESAB', status: 'ordered' },
      ],
      updates: [
        { date: '2024-09-01', title: 'Foundation Work Completed', description: 'Quality inspection passed.', status: 'completed' }
      ],
      team: { contractors: ['Mumbai Steel Contractors Pvt Ltd'], supervisors: ['Rajesh Kumar'], laborCount: 24 },
      approvals: [{ type: 'Material Purchase Order', status: 'pending', date: '2024-09-05' }]
    },
    {
      id: 2,
      name: 'Pune Industrial Warehouse',
      location: 'Pune, Maharashtra',
      city: 'Pune',
      progress: 40,
      startDate: 'Feb 2024',
      expectedCompletion: 'May 2024',
      type: 'Industrial',
      client: 'Bajaj Auto Limited',
      coordinates: [18.5204, 73.8567],
      budget: { total: 3200000, spent: 1280000, remaining: 1920000, pending: 320000 },
      materials: [
        { name: 'Steel Trusses', quantity: '32 units', cost: 1600000, supplier: 'Tata Steel', status: 'ordered' }
      ],
      updates: [{ date: '2024-08-30', title: 'Site Preparation Complete', status: 'completed' }],
      team: { contractors: ['Pune Industrial Solutions'], supervisors: ['Amit Sharma'], laborCount: 18 },
      approvals: [{ type: 'Steel Quality Certificate', status: 'pending', date: '2024-09-01' }]
    },
    {
      id: 3,
      name: 'Nashik Residential Complex',
      location: 'Nashik, Maharashtra',
      city: 'Nashik',
      progress: 60,
      startDate: 'Dec 2023',
      expectedCompletion: 'Apr 2024',
      type: 'Residential',
      client: 'Godrej Properties',
      coordinates: [19.9975, 73.7898],
      budget: { total: 4500000, spent: 2700000, remaining: 1800000, pending: 450000 },
      materials: [
        { name: 'TMT Bars', quantity: '75 tons', cost: 3000000, supplier: 'Kamdhenu Steel', status: 'delivered' }
      ],
      updates: [{ date: '2024-09-02', title: 'Balcony Steel Work', status: 'in-progress' }],
      team: { contractors: ['Nashik Construction Co.'], supervisors: ['Prakash Desai'], laborCount: 30 },
      approvals: [{ type: 'Building Plan Approval', status: 'approved', date: '2024-08-15' }]
    },
    {
      id: 8,
      name: 'Nagpur Tech Park',
      location: 'Nagpur, Maharashtra',
      city: 'Nagpur',
      progress: 85,
      startDate: 'Nov 2023',
      expectedCompletion: 'Feb 2024',
      type: 'Commercial',
      client: 'Infosys Technologies',
      coordinates: [21.1458, 79.0882],
      budget: { total: 6000000, spent: 5100000, remaining: 900000, pending: 200000 },
      materials: [
        { name: 'Structural Steel', quantity: '80 tons', cost: 4000000, supplier: 'Tata Steel', status: 'delivered' }
      ],
      updates: [{ date: '2024-09-03', title: 'Final Phase Initiated', status: 'in-progress' }],
      team: { contractors: ['Nagpur Steel Works'], supervisors: ['Suresh Patil'], laborCount: 35 },
      approvals: [{ type: 'Final Inspection', status: 'pending', date: '2024-09-10' }]
    },
    {
      id: 9,
      name: 'Aurangabad Manufacturing Unit',
      location: 'Aurangabad, Maharashtra',
      city: 'Aurangabad',
      progress: 55,
      startDate: 'Jan 2024',
      expectedCompletion: 'Jun 2024',
      type: 'Industrial',
      client: 'Tata Steel Limited',
      coordinates: [19.8762, 75.3433],
      budget: { total: 7500000, spent: 4125000, remaining: 3375000, pending: 750000 },
      materials: [
        { name: 'Heavy Steel Frames', quantity: '100 tons', cost: 5000000, supplier: 'SAIL', status: 'delivered' }
      ],
      updates: [{ date: '2024-09-04', title: 'Framework Assembly', status: 'in-progress' }],
      team: { contractors: ['Aurangabad Heavy Industries'], supervisors: ['Vikram Rao'], laborCount: 42 },
      approvals: [{ type: 'Environmental Clearance', status: 'approved', date: '2024-08-20' }]
    }
  ];

  const orderedOngoingProjects = currentUser
    ? [
        ...ongoingProjects.filter((p) => p.client === currentUser.displayName || p.client === currentUser.email),
        ...ongoingProjects.filter((p) => p.client !== currentUser.displayName && p.client !== currentUser.email),
      ]
    : ongoingProjects;

  const completedProjects = [
    {
      id: 4,
      name: 'Aurangabad Steel Plant',
      location: 'Aurangabad, Maharashtra',
      completionDate: 'Dec 2023',
      type: 'Industrial',
      client: 'Tata Steel Limited'
    },
    {
      id: 5,
      name: 'Kolhapur Shopping Mall',
      location: 'Kolhapur, Maharashtra',
      completionDate: 'Nov 2023',
      type: 'Commercial',
      client: 'Phoenix Mills Limited'
    },
    {
      id: 6,
      name: 'Nagpur Office Building',
      location: 'Nagpur, Maharashtra',
      completionDate: 'Oct 2023',
      type: 'Commercial',
      client: 'Infosys Technologies'
    },
    {
      id: 7,
      name: 'Solapur Residential Towers',
      location: 'Solapur, Maharashtra',
      completionDate: 'Sep 2023',
      type: 'Residential',
      client: 'Mahindra Lifespace'
    }
  ];

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance
    const map = L.map(mapRef.current).setView([19.7515, 75.7139], 7);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);

    // Custom marker icon with pulsing animation
    ongoingProjects.forEach((project, index) => {
      const markerIcon = L.divIcon({
        html: `
          <div style="position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;">
            <div style="
              position: absolute;
              width: 32px;
              height: 32px;
              background: #2563eb;
              border-radius: 50%;
              opacity: 0.4;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              animation-delay: ${index * 0.3}s;
            "></div>
            <div style="
              position: relative;
              z-index: 10;
              width: 24px;
              height: 24px;
              background: #2563eb;
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
                animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              "></div>
            </div>
          </div>
          <style>
            @keyframes ping {
              0% { transform: scale(1); opacity: 0.4; }
              75%, 100% { transform: scale(2); opacity: 0; }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          </style>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20],
        className: 'custom-marker-icon'
      });

      const marker = L.marker(project.coordinates, { icon: markerIcon }).addTo(map);
      
      // Popup content
      const popupContent = `
        <div style="padding: 12px; min-width: 200px;">
          <div style="font-weight: bold; color: #1e293b; margin-bottom: 4px;">${project.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${project.city}</div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <div style="flex: 1; background: #e2e8f0; border-radius: 9999px; height: 6px; overflow: hidden;">
              <div style="background: #2563eb; height: 100%; width: ${project.progress}%; border-radius: 9999px;"></div>
            </div>
            <span style="font-size: 12px; font-weight: 600; color: #2563eb;">${project.progress}%</span>
          </div>
          <button 
            onclick="window.openProjectDetails(${project.id})"
            style="
              margin-top: 12px;
              width: 100%;
              background: #1e293b;
              color: white;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              border: none;
              cursor: pointer;
            "
          >
            View Details
          </button>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Global function to open project details from map popup
  useEffect(() => {
    window.openProjectDetails = (projectId) => {
      const project = ongoingProjects.find(p => p.id === projectId);
      if (project) {
        handleProjectClick(project);
      }
    };

    return () => {
      delete window.openProjectDetails;
    };
  }, [ongoingProjects]);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SteelWorks</h1>
                <p className="text-xs text-slate-500">Infrastructure Solutions</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>
              <a href="/projects" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
                Projects
              </a>
              <a href="/services" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Services
              </a>
              <a href="/about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                About
              </a>
              <a href="/contact" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">
                Contact
              </a>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              {currentUser ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-slate-900">{currentUser.displayName}</p>
                    <p className="text-xs text-slate-500">{currentUser.email}</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
              ) : (
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
        
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-6 bg-blue-500/20 text-blue-200 border-blue-400/30 px-4 py-2 text-sm font-medium">
              Our Projects
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              MAHARASHTRA'S STEEL INFRASTRUCTURE
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Building the foundations of tomorrow with precision-engineered steel solutions across the state.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">{ongoingProjects.length}</div>
                <div className="text-sm text-blue-200 mt-2">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">{completedProjects.length}</div>
                <div className="text-sm text-blue-200 mt-2">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">₹{(ongoingProjects.reduce((sum, p) => sum + p.budget.total, 0) / 10000000).toFixed(1)}Cr</div>
                <div className="text-sm text-blue-200 mt-2">Total Value</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Section */}
      <div className="container mx-auto px-6 -mt-16 relative z-20 mb-20">
        <Card className="overflow-hidden border-0 shadow-2xl bg-white">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">
                  PROJECT LOCATIONS
                </CardTitle>
                <CardDescription className="text-base mt-2">
                  Interactive map - markers move with the map
                </CardDescription>
              </div>
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 px-4 py-2"
              >
                {ongoingProjects.length} Active Sites
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div ref={mapRef} className="w-full h-[600px]"></div>

            {/* Project List Below Map */}
            <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ongoingProjects.map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleProjectClick(project)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative w-3 h-3 mt-1 flex-shrink-0">
                        <div className="absolute w-3 h-3 rounded-full bg-blue-600" />
                        <div className="absolute w-3 h-3 rounded-full bg-blue-400 animate-ping" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-900 text-sm">{project.name}</h4>
                        <p className="text-xs text-slate-600 mt-1">{project.city}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 bg-slate-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-blue-600">{project.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ongoing Projects Section */}
      <div className="container mx-auto px-6 pb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">ONGOING WORKS</h2>
              <p className="text-slate-600">Real-time project monitoring and status updates</p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
              <TrendingUp className="w-4 h-4 mr-2" />
              {ongoingProjects.length} Active
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderedOngoingProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="group hover:shadow-2xl transition-all duration-300 cursor-pointer border-0 bg-white overflow-hidden h-full"
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
                  
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <Badge className={`
                        ${project.type === 'Commercial' ? 'bg-purple-100 text-purple-700 border-purple-300' : ''}
                        ${project.type === 'Industrial' ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}
                        ${project.type === 'Residential' ? 'bg-green-100 text-green-700 border-green-300' : ''}
                      `}>
                        {project.type}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{project.progress}%</div>
                        <div className="text-xs text-slate-500">Complete</div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {project.name}
                    </CardTitle>
                    
                    <CardDescription className="flex items-center gap-2 mt-2 text-slate-600">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{project.location}</span>
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <Progress value={project.progress} className="h-2.5" />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-slate-600 mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Started</span>
                        </div>
                        <div className="text-sm font-bold text-slate-900">{project.startDate}</div>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-blue-600 mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-medium">Target</span>
                        </div>
                        <div className="text-sm font-bold text-blue-900">{project.expectedCompletion}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600 font-medium">Client</span>
                        <Building className="w-4 h-4 text-slate-400" />
                      </div>
                      <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                        {project.client}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">Budget</div>
                        <div className="text-sm font-bold text-slate-900">
                          ₹{(project.budget.total / 100000).toFixed(0)}L
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">Materials</div>
                        <div className="text-sm font-bold text-slate-900">
                          {project.materials.length}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-slate-500 mb-1">Workers</div>
                        <div className="text-sm font-bold text-slate-900">
                          {project.team.laborCount}
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full bg-slate-900 hover:bg-blue-600 group-hover:bg-blue-600 transition-colors mt-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project);
                      }}
                    >
                      View Full Dashboard
                      <ArrowUpRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Completed Projects Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-green-500/20 text-green-300 border-green-400/30 px-4 py-2">
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Badge>
              <h2 className="text-4xl font-bold text-white mb-3">COMPLETED PORTFOLIO</h2>
              <p className="text-blue-200 text-lg">Delivering excellence across Maharashtra</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {completedProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="group overflow-hidden border-0 bg-white/95 backdrop-blur hover:bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-200 to-blue-100">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Building className="w-20 h-20 text-slate-400 group-hover:text-blue-500 transition-colors" />
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-green-500 text-white border-0 shadow-lg">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge variant="outline" className="bg-white/90 backdrop-blur border-slate-300">
                          {project.type}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {project.name}
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-600">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="line-clamp-1">{project.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-slate-600">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>Completed {project.completionDate}</span>
                        </div>

                        <div className="pt-3 border-t border-slate-100">
                          <div className="text-xs text-slate-500 mb-1">Client</div>
                          <div className="text-sm font-semibold text-slate-900 line-clamp-1">
                            {project.client}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Project Dashboard Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{selectedProject.name}</h2>
                    <p className="text-blue-200">{selectedProject.location}</p>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white hover:text-blue-200 transition-colors text-2xl font-bold"
                  >
                    ×
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Badge className={`
                    ${selectedProject.type === 'Commercial' ? 'bg-purple-500 text-white' : ''}
                    ${selectedProject.type === 'Industrial' ? 'bg-orange-500 text-white' : ''}
                    ${selectedProject.type === 'Residential' ? 'bg-green-500 text-white' : ''}
                  `}>
                    {selectedProject.type}
                  </Badge>
                  <div className="text-sm">
                    <span className="text-blue-200">Progress:</span>
                    <span className="font-bold ml-2">{selectedProject.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Progress Section */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Project Progress</h3>
                  <Progress value={selectedProject.progress} className="h-3 mb-2" />
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>Started: {selectedProject.startDate}</span>
                    <span>Target: {selectedProject.expectedCompletion}</span>
                  </div>
                </div>

                {/* Budget Overview */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Budget Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-xs text-slate-500 mb-1">Total Budget</div>
                      <div className="text-lg font-bold text-slate-900">₹{(selectedProject.budget.total / 100000).toFixed(1)}L</div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-xs text-blue-600 mb-1">Spent</div>
                      <div className="text-lg font-bold text-blue-900">₹{(selectedProject.budget.spent / 100000).toFixed(1)}L</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-xs text-green-600 mb-1">Remaining</div>
                      <div className="text-lg font-bold text-green-900">₹{(selectedProject.budget.remaining / 100000).toFixed(1)}L</div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div className="text-xs text-orange-600 mb-1">Pending</div>
                      <div className="text-lg font-bold text-orange-900">₹{(selectedProject.budget.pending / 100000).toFixed(1)}L</div>
                    </div>
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Materials Status</h3>
                  <div className="space-y-3">
                    {selectedProject.materials.map((material, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{material.name}</div>
                          <div className="text-sm text-slate-600">{material.quantity} • {material.supplier}</div>
                        </div>
                        <div className="text-right mr-4">
                          <div className="font-bold text-slate-900">₹{(material.cost / 100000).toFixed(1)}L</div>
                        </div>
                        <Badge className={`
                          ${material.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-300' : ''}
                          ${material.status === 'ordered' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''}
                          ${material.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}
                        `}>
                          {material.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Team Details</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-xs text-slate-500 mb-2">Contractors</div>
                      {selectedProject.team.contractors.map((contractor, idx) => (
                        <div key={idx} className="text-sm font-semibold text-slate-900">{contractor}</div>
                      ))}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-xs text-slate-500 mb-2">Supervisors</div>
                      {selectedProject.team.supervisors.map((supervisor, idx) => (
                        <div key={idx} className="text-sm font-semibold text-slate-900">{supervisor}</div>
                      ))}
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-xs text-slate-500 mb-2">Labor Count</div>
                      <div className="text-2xl font-bold text-slate-900">{selectedProject.team.laborCount}</div>
                    </div>
                  </div>
                </div>

                {/* Client Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Client Information</h3>
                  <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 rounded-lg flex items-center gap-3">
                    <Building className="w-8 h-8 text-blue-600" />
                    <div className="font-semibold text-slate-900 text-lg">{selectedProject.client}</div>
                  </div>
                </div>

                {/* Recent Updates */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Recent Updates</h3>
                  <div className="space-y-3">
                    {selectedProject.updates.map((update, idx) => (
                      <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          update.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900">{update.title}</div>
                          <div className="text-sm text-slate-600">{update.description}</div>
                          <div className="text-xs text-slate-500 mt-1">{update.date}</div>
                        </div>
                        <Badge className={`
                          ${update.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}
                        `}>
                          {update.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Approvals */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Approvals & Compliance</h3>
                  <div className="space-y-3">
                    {selectedProject.approvals.map((approval, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-slate-900">{approval.type}</div>
                          <div className="text-sm text-slate-600">Date: {approval.date}</div>
                        </div>
                        <Badge className={`
                          ${approval.status === 'approved' ? 'bg-green-100 text-green-700 border-green-300' : ''}
                          ${approval.status === 'pending' ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}
                        `}>
                          {approval.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;