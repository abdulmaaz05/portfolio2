const menu = document.getElementById("menu");
const navLinks = document.getElementById("navLinks");

menu.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("active");
  });
});

const sections = document.querySelectorAll("section");
sections.forEach(sec => sec.classList.add("reveal"));

function reveal(){
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if(top < window.innerHeight - 120){
      sec.classList.add("active");
    }
  });
}

window.addEventListener("scroll", reveal);
reveal();

const glow = document.querySelector(".cursor-glow");

window.addEventListener("mousemove", e => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = {
  x: null,
  y: null
};

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

function resize(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", () => {
  resize();
  init();
});

resize();

class Particle{
  constructor(){
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.size = Math.random() * 2 + 1;
  }

  update(){
    if(mouse.x !== null && mouse.y !== null){
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if(distance < 130){
        this.x -= dx * 0.018;
        this.y -= dy * 0.018;
      }
    }

    this.x += this.vx;
    this.y += this.vy;

    if(this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if(this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw(){
    ctx.fillStyle = "#ff7a00";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init(){
  particles = [];
  const count = window.innerWidth < 768 ? 55 : 110;

  for(let i = 0; i < count; i++){
    particles.push(new Particle());
  }
}

function connect(){
  for(let i = 0; i < particles.length; i++){
    for(let j = i + 1; j < particles.length; j++){
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if(distance < 155){
        ctx.strokeStyle = `rgba(255,122,0,${0.28 * (1 - distance / 155)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connect();
  requestAnimationFrame(animate);
}

init();
animate();
