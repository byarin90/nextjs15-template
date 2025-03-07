"use client"
import { Button } from "@/components/ui/button";
import { useEffect } from "react";


export default function AnimationPage() {
  const animations = [
    {
      name: "Slide Up",
      class: "animate-in slide-in-from-bottom duration-800",
      description: "Element slides up into view",
      component: (
        <div className="animate-in slide-in-from-bottom duration-800 bg-primary text-primary-foreground p-4 rounded-lg">
          Sliding Up
        </div>
      ),
    },
    {
      name: "Fade In",
      class: "animate-in fade-in duration-800",
      description: "Element fades into view",
      component: (
        <div className="animate-in fade-in duration-800 bg-secondary text-secondary-foreground p-4 rounded-lg">
          Fading In
        </div>
      ),
    },
    {
      name: "Slide In Right",
      class: "animate-in slide-in-from-left duration-800",
      description: "Element slides in from the left",
      component: (
        <div className="animate-in slide-in-from-left duration-800 bg-accent text-accent-foreground p-4 rounded-lg">
          Sliding from Left
        </div>
      ),
    },
    {
      name: "Scale Up",
      class: "animate-in zoom-in duration-800",
      description: "Element scales up into view",
      component: (
        <div className="animate-in zoom-in duration-800 bg-muted text-muted-foreground p-4 rounded-lg">
          Scaling Up
        </div>
      ),
    },
    {
      name: "Spin",
      class: "animate-spin",
      description: "Element spins continuously",
      component: (
        <div className="animate-spin inline-block bg-chart-1 text-white p-4 rounded-lg">
          ⚙️
        </div>
      ),
    },
    {
      name: "Bounce",
      class: "animate-bounce",
      description: "Element bounces up and down",
      component: (
        <div className="animate-bounce bg-chart-2 text-white p-4 rounded-lg">
          Bouncing
        </div>
      ),
    },
    {
      name: "Pulse",
      class: "animate-pulse",
      description: "Element pulses with opacity",
      component: (
        <div className="animate-pulse bg-chart-3 text-white p-4 rounded-lg">
          Pulsing
        </div>
      ),
    },
    {
      name: "Ping",
      class: "animate-ping",
      description: "Element pings with scale",
      component: (
        <div className="relative">
          <div className="absolute animate-ping bg-chart-4 w-full h-full rounded-lg opacity-75"></div>
          <div className="bg-chart-4 text-white p-4 rounded-lg relative">Pinging</div>
        </div>
      ),
    },
  ];

  const AnimationCard = ({ animation }: { animation: typeof animations[0] }) => (
    <div className="border border-border rounded-lg p-6 space-y-4 bg-background">
      <h3 className="text-xl font-semibold text-foreground">{animation.name}</h3>
      <p className="text-sm text-muted-foreground">{animation.description}</p>
      <code className="text-xs bg-muted p-2 rounded block">{animation.class}</code>
      <div className="h-24 flex items-center justify-center">
        {animation.component}
      </div>
    </div>
  );

  useEffect(()=>{
    setInterval(()=>{
        window.location.reload()
    },2000)
  },[])
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Animation System</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animations.map((animation) => (
          <AnimationCard key={animation.name} animation={animation} />
        ))}
      </div>

      <div className="mt-12 space-y-8">
        <h2 className="text-2xl font-bold text-foreground">Animation Examples</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border border-border rounded-lg bg-background">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Interactive Button</h3>
            <Button className="animate-float hover:animate-none">
              Floating Button
            </Button>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-foreground">Loading State</h3>
            <div className="flex items-center gap-4">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              <span className="text-muted-foreground">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
