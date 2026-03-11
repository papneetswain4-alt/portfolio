import { useEffect, useRef } from "react";

export default function WebBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false }); // Optimize performance

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse interactive forces
    const mouse = { x: -1000, y: -1000, radius: 150 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Node Physics class
    class Node {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.baseX = x;
        this.baseY = y;
        this.size = Math.random() * 1.5 + 0.5;
        this.density = Math.random() * 20 + 5;
        this.vx = 0;
        this.vy = 0;
      }

      update() {
        // Distance between mouse and node
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Repel force
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;

        const maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;

        // "Spider-sense" push effect
        if (distance < mouse.radius) {
          this.vx -= forceDirectionX * force * this.density * 0.6;
          this.vy -= forceDirectionY * force * this.density * 0.6;
        }

        // Spring back to base position
        this.vx += (this.baseX - this.x) * 0.05; // Spring stiffness
        this.vy += (this.baseY - this.y) * 0.05;

        // Damping (friction)
        this.vx *= 0.8;
        this.vy *= 0.8;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx.fillStyle = "rgba(225, 6, 0, 0.4)";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    let nodes = [];
    const initNodes = () => {
      nodes = [];
      const density = Math.floor((width * height) / 15000); // Responsive amount of nodes
      for (let i = 0; i < density; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        nodes.push(new Node(x, y));
      }
    };
    initNodes();

    let animId;
    const connectNodes = () => {
      for (let a = 0; a < nodes.length; a++) {
        for (let b = a; b < nodes.length; b++) {
          let dx = nodes[a].x - nodes[b].x;
          let dy = nodes[a].y - nodes[b].y;
          let distance = dx * dx + dy * dy;

          if (distance < 15000) {
            let opacity = 1 - distance / 15000;
            ctx.strokeStyle = `rgba(225, 6, 0, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[a].x, nodes[a].y);
            ctx.lineTo(nodes[b].x, nodes[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.fillStyle = "#0a0a0f"; // Must match var(--bg-color)
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update();
        nodes[i].draw();
      }
      connectNodes();
      
      animId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initNodes();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="web-canvas" style={{ opacity: 0.8, background: '#0a0a0f' }} />;
}
