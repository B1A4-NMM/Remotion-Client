import React, { useEffect, useRef } from "react";

const ParticleLoader = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const PI = Math.PI;
    const TAU = PI * 2;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = 300;
    const height = 300;
    const min = width * 0.5;
    const particles: Particle[] = [];
    let globalAngle = 0;
    let tick = 0;
    let now = 0;
    let frameDiff = 0;
    let lastFrame = 0;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.globalCompositeOperation = "lighter";

    class Particle {
      x: number;
      y: number;
      angle: number;
      speed: number;
      accel: number;
      radius: number = 7;
      decay: number = 0.01;
      life: number = 1;

      constructor(opt: { x: number; y: number; angle: number; speed: number; accel: number }) {
        this.x = opt.x;
        this.y = opt.y;
        this.angle = opt.angle;
        this.speed = opt.speed;
        this.accel = opt.accel;
      }

      step(i: number) {
        this.speed += this.accel;
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.angle += PI / 64;
        this.accel *= 1.01;
        this.life -= this.decay;

        if (this.life <= 0) {
          particles.splice(i, 1);
        }
      }

      draw(i: number) {
        ctx.fillStyle = `hsla(${tick + this.life * 120}, 60%, 80%, ${this.life})`;
        ctx.strokeStyle = ctx.fillStyle;
        ctx.beginPath();
        if (particles[i - 1]) {
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(particles[i - 1].x, particles[i - 1].y);
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0.001, this.life * this.radius), 0, TAU);
        ctx.fill();

        const size = Math.random() * 1.25;
        ctx.fillRect(
          ~~(this.x + (Math.random() - 0.5) * 35 * this.life),
          ~~(this.y + (Math.random() - 0.5) * 35 * this.life),
          size,
          size
        );
      }
    }

    function step() {
      particles.push(
        new Particle({
          x: width / 2 + (Math.cos(tick / 20) * min) / 2,
          y: height / 2 + (Math.sin(tick / 20) * min) / 2,
          angle: globalAngle,
          speed: 0,
          accel: 0.01,
        })
      );

      particles.forEach((p, i) => p.step(i));
      globalAngle += PI / 3;
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, i) => p.draw(i));
    }

    function loop() {
      requestAnimationFrame(loop);
      now = Date.now();
      frameDiff = now - lastFrame;
      if (frameDiff >= 1000 / 60) {
        lastFrame = now;
        step();
        draw();
        tick++;
      }
    }

    loop();
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ParticleLoader;
