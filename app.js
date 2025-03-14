const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 500;

const particleCount = 10000;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    const color = Math.random();
    colors[i * 3] = color < 0.33 ? 0.5 : color < 0.66 ? 0.2 : 1;
    colors[i * 3 + 1] = color < 0.33 ? 0.2 : color < 0.66 ? 0.5 : 0.8;
    colors[i * 3 + 2] = color < 0.33 ? 1 : color < 0.66 ? 0.8 : 0.5;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

const ambientLight = new THREE.AmbientLight(0x202020);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animateNebula() {
    requestAnimationFrame(animateNebula);
    const time = Date.now() * 0.0005;
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(time + positions[i3] * 0.01) * 0.5;
    }
    particlesGeometry.attributes.position.needsUpdate = true;

    camera.position.x += (mouseX * 200 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 100 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

animateNebula();

const aboutCanvas = document.getElementById('about-canvas');
const aboutScene = new THREE.Scene();
const aboutCamera = new THREE.PerspectiveCamera(75, aboutCanvas.clientWidth / aboutCanvas.clientHeight, 0.1, 1000);
const aboutRenderer = new THREE.WebGLRenderer({ canvas: aboutCanvas, alpha: true });

aboutRenderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
aboutCamera.position.z = 5;

const aboutGeometry = new THREE.PlaneGeometry(4, 4);
const aboutMaterial = new THREE.MeshPhongMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.5 });
const aboutPlane = new THREE.Mesh(aboutGeometry, aboutMaterial);
aboutScene.add(aboutPlane);

const aboutAmbientLight = new THREE.AmbientLight(0x404040);
aboutScene.add(aboutAmbientLight);

const aboutDirectionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
aboutDirectionalLight.position.set(0, 1, 1);
aboutScene.add(aboutDirectionalLight);

aboutPlane.visible = false;

function animateAbout() {
    requestAnimationFrame(animateAbout);
    if (aboutPlane.visible) {
        aboutPlane.rotation.y += 0.02;
        aboutCamera.position.z = Math.max(2, aboutCamera.position.z - 0.05);
        aboutCamera.lookAt(aboutPlane.position);
    }
    aboutRenderer.render(aboutScene, aboutCamera);
}

animateAbout();

const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');

            if (entry.target.id === 'about') {
                if (!aboutPlane.visible) {
                    aboutPlane.visible = true;
                    aboutPlane.position.set(0, 0, 0);
                    aboutPlane.rotation.y = 0;
                    aboutCamera.position.z = 5;
                }
                const aboutContent = entry.target.querySelector('.about-content');
                if (aboutContent) {
                    aboutContent.classList.add('animate-zoom-in');
                }
            }

            if (entry.target.id === 'skills' || entry.target.id === 'projects') {
                const cards = entry.target.querySelectorAll('.card-item');
                cards.forEach((card, index) => {
                    card.style.animation = `cardRotateIn 0.8s ease-out ${index * 0.2}s forwards`;
                });
            }

            if (entry.target.id === 'contact') {
                const contactItems = entry.target.querySelectorAll('.contact-item');
                contactItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.style.animation = 'contactFadeIn 0.5s ease-out forwards';
                    }, index * 200);
                });
            }
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => {
    observer.observe(section);
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        targetSection.scrollIntoView({ behavior: 'smooth' });
        targetSection.classList.add('animate-fade-in');

        if (targetId === 'about') {
            aboutPlane.visible = true;
            aboutPlane.position.set(0, 0, 0);
            aboutPlane.rotation.y = 0;
            aboutCamera.position.z = 5;
            const aboutContent = targetSection.querySelector('.about-content');
            if (aboutContent) {
                aboutContent.classList.add('animate-zoom-in');
            }
        }

        if (targetId === 'skills' || targetId === 'projects') {
            const cards = targetSection.querySelectorAll('.card-item');
            cards.forEach((card, index) => {
                card.style.animation = `cardRotateIn 0.8s ease-out ${index * 0.2}s forwards`;
            });
        }

        if (targetId === 'contact') {
            const contactItems = targetSection.querySelectorAll('.contact-item');
            contactItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.animation = 'contactFadeIn 0.5s ease-out forwards';
                }, index * 200);
            });
        }
    });
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    aboutCamera.aspect = aboutCanvas.clientWidth / aboutCanvas.clientHeight;
    aboutCamera.updateProjectionMatrix();
    aboutRenderer.setSize(aboutCanvas.clientWidth, aboutCanvas.clientHeight);
});
