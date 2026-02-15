import { useEffect, useRef } from "react";

export default function WebBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    let angle = 0;

    const drawWeb = () => {
      ctx.clearRect(0, 0, width, height);

      // 🔥 Move web origin to top-left
      const centerX = -width * -0.1;
      const centerY = -height * -0.3;


      const rings = 8;
      const spokes = 12;
      const maxRadius = Math.max(width, height) * 0.9;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);

      ctx.strokeStyle = "rgba(225, 6, 0, 0.2)";
      ctx.lineWidth = 1;

      // 🔥 Draw polygon rings
      for (let r = 1; r <= rings; r++) {
        const radius = (maxRadius / rings) * r;
        ctx.beginPath();

        for (let i = 0; i <= spokes; i++) {
          const theta = (Math.PI * 2 / spokes) * i;
          const x = radius * Math.cos(theta);
          const y = radius * Math.sin(theta);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      }

      // 🔥 Draw spokes
      for (let i = 0; i < spokes; i++) {
        const theta = (Math.PI * 2 / spokes) * i;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          maxRadius * Math.cos(theta),
          maxRadius * Math.sin(theta)
        );
        ctx.stroke();
      }

      ctx.restore();

      angle += 0.0004; // slow cinematic rotation
      requestAnimationFrame(drawWeb);
    };

    drawWeb();

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

  }, []);

  return <canvas ref={canvasRef} className="web-canvas" />;
}
