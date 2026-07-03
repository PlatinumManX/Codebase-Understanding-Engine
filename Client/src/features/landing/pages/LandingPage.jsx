import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import HeroSection from '../components/HeroSection';
import DecodingSection from '../components/DecodingSection';
import FlowSection from '../components/FlowSection';
import AISection from '../components/AISection';
import PreviewSection from '../components/PreviewSection';
import PricingPage from './PricingPage';
import DocsPage from './DocsPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import CTASection from '../components/CTASection';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  // Hero refs
  const heroZipRef = useRef(null);

  // Decoding Section refs
  const decodingContainerRef = useRef(null);
  const decodingText1Ref = useRef(null);
  const decodingText2Ref = useRef(null);
  const decodingZipRef = useRef(null);
  const decodingFilesRef = useRef(null);
  const decodingGraphRef = useRef(null);
  const decodingEdgesRef = useRef(null);
  const decodingFileRefs = useRef([]);
  const decodingNodeRefs = useRef([]);

  // Flow Section refs
  const flowContainerRef = useRef(null);
  const flowTitleRef = useRef(null);
  const flowDescRef = useRef(null);
  const flowGraphRef = useRef(null);
  const flowPathNodesRefs = useRef([]);
  const flowPathEdgesRefs = useRef([]);
  const flowPulseRef = useRef(null);

  // AI Section refs
  const aiContainerRef = useRef(null);
  const aiTitleRef = useRef(null);
  const aiDescRef = useRef(null);
  const aiGraphContainerRef = useRef(null);
  const aiPanelRef = useRef(null);
  const aiPromptTextRef = useRef(null);
  const aiResponseTextRef = useRef(null);
  const aiNodesRefs = useRef([]);
  const aiEdgesRefs = useRef(null);

  // Preview Section refs
  const previewContainerRef = useRef(null);
  const previewDashboardRef = useRef(null);
  const previewStatRefs = useRef([]);

  useEffect(() => {
    // 1. Initialize Lenis Smooth Scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // 2. TIMELINE 1: Hero to Decoding Transition
    // Move zip card from hero to decoding section start
    gsap.fromTo(heroZipRef.current,
      { y: 0, opacity: 1, scale: 1 },
      {
        y: 100,
        opacity: 0,
        scale: 0.9,
        scrollTrigger: {
          trigger: heroZipRef.current,
          start: "top 70%",
          end: "bottom 30%",
          scrub: true
        }
      }
    );

    // 3. TIMELINE 2: Decoding Section (Zip -> Files -> Graph)
    // GSAP Pinning: Lock the section while animating files and connections
    const decTl = gsap.timeline({
      scrollTrigger: {
        trigger: decodingContainerRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    // Reset initial states
    gsap.set(decodingZipRef.current, { opacity: 1, scale: 1 });
    gsap.set(decodingFilesRef.current, { opacity: 0 });
    gsap.set(decodingGraphRef.current, { opacity: 0, scale: 0.95 });
    decodingFileRefs.current.forEach(file => {
      if (file) gsap.set(file, { x: 0, y: 0, opacity: 0, scale: 0.8 });
    });
    decodingNodeRefs.current.forEach(node => {
      if (node) gsap.set(node, { opacity: 0, scale: 0.8 });
    });

    // Step A: Zip card zooms in and fades, files fade in and explode outward
    decTl.to(decodingZipRef.current, { opacity: 0, scale: 0.8, duration: 0.2 }, 0)
         .to(decodingFilesRef.current, { opacity: 1, duration: 0.1 }, 0.1);

    // Coordinates for loose files explosion
    const fileCoords = [
      { x: -130, y: -120 }, // app.py
      { x: 130, y: -120 },  // routes.py
      { x: -160, y: 0 },    // auth.py
      { x: 160, y: 0 },     // payment.py
      { x: -130, y: 120 },  // users.py
      { x: 130, y: 120 }    // database.py
    ];

    decodingFileRefs.current.forEach((file, idx) => {
      if (file) {
        decTl.to(file, {
          x: fileCoords[idx].x,
          y: fileCoords[idx].y,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        }, 0.1);
      }
    });

    // Step B: Text 1 fades out, Text 2 fades in, files morph into graph nodes
    decTl.to(decodingText1Ref.current, { opacity: 0, duration: 0.2 }, 0.4)
         .to(decodingText2Ref.current, { opacity: 1, duration: 0.2 }, 0.6);

    decTl.to(decodingFilesRef.current, { opacity: 0, scale: 0.9, duration: 0.3 }, 0.5)
         .to(decodingGraphRef.current, { opacity: 1, scale: 1, duration: 0.3 }, 0.5);

    // Animate graph nodes & edges
    decodingNodeRefs.current.forEach(node => {
      if (node) {
        decTl.to(node, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(1.5)" }, 0.6);
      }
    });


    // 4. TIMELINE 3: Flow Section (Trace paths)
    // GSAP Pinning: Lock Flow section to highlight request hops sequentially
    const flowTl = gsap.timeline({
      scrollTrigger: {
        trigger: flowContainerRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    // Start with all path items translucent
    flowPathNodesRefs.current.forEach(node => {
      if (node) gsap.set(node, { opacity: 0.2 });
    });
    flowPathEdgesRefs.current.forEach(edge => {
      if (edge) gsap.set(edge, { opacity: 0.15, stroke: "#1e293b" });
    });

    // Light up path steps sequentially
    flowPathNodesRefs.current.forEach((node, idx) => {
      if (node) {
        flowTl.to(node, { opacity: 1, scale: 1.1, duration: 0.1 }, idx * 0.15);
        if (idx > 0 && flowPathEdgesRefs.current[idx - 1]) {
          flowTl.to(flowPathEdgesRefs.current[idx - 1], {
            opacity: 1,
            stroke: "#00f0ff",
            strokeWidth: 2.5,
            duration: 0.1
          }, (idx - 1) * 0.15 + 0.05);
        }
      }
    });

    // Animate flow tracer pulse ball along y axis
    const pulseYCoords = [55, 125, 195, 265, 335, 395];
    gsap.set(flowPulseRef.current, { attr: { cx: 260, cy: 55, r: 6.5 }, opacity: 0 });

    flowTl.to(flowPulseRef.current, {
      opacity: 1,
      duration: 0.05
    }, 0);

    pulseYCoords.forEach((y, idx) => {
      if (idx > 0) {
        flowTl.to(flowPulseRef.current, {
          attr: { cy: y },
          duration: 0.15,
          ease: "none"
        }, (idx - 1) * 0.15);
      }
    });

    flowTl.to(flowPulseRef.current, {
      opacity: 0,
      duration: 0.05
    }, 0.85);


    // 5. TIMELINE 4: AI Section (Graph shift & Prompt typing)
    // GSAP Pinning: Lock AI section while prompt and response type out
    const aiTl = gsap.timeline({
      scrollTrigger: {
        trigger: aiContainerRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        pin: true,
        anticipatePin: 1
      }
    });

    // Initial positioning
    gsap.set(aiGraphContainerRef.current, { x: 80, scale: 0.95 });
    gsap.set(aiPanelRef.current, { x: 100, opacity: 0 });

    // Step A: Shift graph left, slide AI panel in
    aiTl.to(aiGraphContainerRef.current, { x: 0, scale: 1, duration: 0.3 }, 0)
        .to(aiPanelRef.current, { x: 0, opacity: 1, duration: 0.3 }, 0);

    // Step B: Type prompt
    const promptText = "Explain authentication workflow.";
    const promptObj = { charCount: 0 };
    aiTl.to(promptObj, {
      charCount: promptText.length,
      duration: 0.25,
      ease: "none",
      onUpdate: () => {
        if (aiPromptTextRef.current) {
          aiPromptTextRef.current.textContent = promptText.slice(0, Math.floor(promptObj.charCount));
        }
      }
    }, 0.35);

    // Step C: Type AI response and highlight nodes
    const responseText = "The authentication workflow routes requests from routes.py down to the controller inside auth.py. This triggers UserModel lookup inside users.py, connecting to database.py.";
    const responseObj = { charCount: 0 };
    
    // Reset highlights initially
    aiNodesRefs.current.forEach(node => {
      if (node) gsap.set(node, { scale: 1 });
    });

    aiTl.to(responseObj, {
      charCount: responseText.length,
      duration: 0.45,
      ease: "none",
      onUpdate: () => {
        if (aiResponseTextRef.current) {
          aiResponseTextRef.current.textContent = responseText.slice(0, Math.floor(responseObj.charCount));
        }

        const progress = responseObj.charCount / responseText.length;
        
        // Highlight node 0 (routes.py)
        if (progress > 0.1 && progress < 0.4) {
          gsap.to(aiNodesRefs.current[0], { scale: 1.35, duration: 0.2 });
        } else {
          gsap.to(aiNodesRefs.current[0], { scale: 1, duration: 0.2 });
        }

        // Highlight node 1 (auth.py)
        if (progress > 0.35 && progress < 0.65) {
          gsap.to(aiNodesRefs.current[1], { scale: 1.35, duration: 0.2 });
        } else {
          gsap.to(aiNodesRefs.current[1], { scale: 1, duration: 0.2 });
        }

        // Highlight node 2 (users.py)
        if (progress > 0.6 && progress < 0.85) {
          gsap.to(aiNodesRefs.current[2], { scale: 1.35, duration: 0.2 });
        } else {
          gsap.to(aiNodesRefs.current[2], { scale: 1, duration: 0.2 });
        }

        // Highlight node 3 (database.py)
        if (progress > 0.8) {
          gsap.to(aiNodesRefs.current[3], { scale: 1.35, duration: 0.2 });
        } else {
          gsap.to(aiNodesRefs.current[3], { scale: 1, duration: 0.2 });
        }
      }
    }, 0.65);


    // 6. TIMELINE 5: Preview Section (Stats count up)
    const stats = [
      { target: 127 },
      { target: 642 },
      { target: 31 },
      { target: 12 }
    ];

    stats.forEach((s, idx) => {
      const obj = { val: 0 };
      gsap.to(obj, {
        val: s.target,
        duration: 1.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: previewContainerRef.current,
          start: "top 60%",
          once: true
        },
        onUpdate: () => {
          if (previewStatRefs.current[idx]) {
            previewStatRefs.current[idx].textContent = Math.floor(obj.val);
          }
        }
      });
    });

    // Cleanup triggers
    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="bg-[#040609] min-h-screen text-gray-200 overflow-x-hidden selection:bg-[#00f0ff]/30 selection:text-white">
      {/* Hero Header Section */}
      <HeroSection zipRef={heroZipRef} />

      {/* Ingestion & Decoding Section */}
      <DecodingSection 
        containerRef={decodingContainerRef}
        text1Ref={decodingText1Ref}
        text2Ref={decodingText2Ref}
        zipRef={decodingZipRef}
        filesRef={decodingFilesRef}
        graphRef={decodingGraphRef}
        edgesRef={decodingEdgesRef}
        fileRefs={decodingFileRefs}
        nodeRefs={decodingNodeRefs}
      />

      {/* Path Execution Section */}
      <FlowSection
        containerRef={flowContainerRef}
        titleRef={flowTitleRef}
        descRef={flowDescRef}
        graphRef={flowGraphRef}
        pathNodesRefs={flowPathNodesRefs}
        pathEdgesRefs={flowPathEdgesRefs}
        pulseRef={flowPulseRef}
      />

      {/* AI Graph Sync Section */}
      <AISection
        containerRef={aiContainerRef}
        titleRef={aiTitleRef}
        descRef={aiDescRef}
        graphContainerRef={aiGraphContainerRef}
        aiPanelRef={aiPanelRef}
        promptTextRef={aiPromptTextRef}
        responseTextRef={aiResponseTextRef}
        nodesRefs={aiNodesRefs}
        edgesRefs={aiEdgesRefs}
      />

      {/* Platform Workspace Preview Section */}
      <PreviewSection
        containerRef={previewContainerRef}
        dashboardRef={previewDashboardRef}
        statRefs={previewStatRefs}
      />

      {/* CTA Footer Section */}
      <CTASection />
    </div>
  );
}
