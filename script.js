
// Mobile nav toggle
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
navToggle && navToggle.addEventListener('click', ()=>{
	nav.classList.toggle('open');
	// toggle aria-expanded
	const expanded = nav.classList.contains('open');
	navToggle.setAttribute('aria-expanded', expanded);
});

// Theme toggle with persistence
const themeToggle = document.getElementById('theme-toggle');
const userPref = localStorage.getItem('theme');
// Default to dark theme unless user explicitly chose 'light'
if (userPref === 'dark' || userPref === null) document.body.classList.add('dark');
themeToggle && themeToggle.addEventListener('click', ()=>{
	document.body.classList.toggle('dark');
	const isDark = document.body.classList.contains('dark');
	localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
	a.addEventListener('click', e=>{
		const href = a.getAttribute('href');
		if(href === '#') return;
		const target = document.querySelector(href);
		if(target){
			e.preventDefault();
			// compute offset to account for sticky header
			const header = document.querySelector('.site-header');
			const headerHeight = header ? header.offsetHeight : 0;
			const y = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12; // small gap
			window.scrollTo({ top: Math.max(0, Math.floor(y)), behavior: 'smooth' });
			// close nav on mobile after click
			if(nav.classList.contains('open')) nav.classList.remove('open');
		}
	})
});

// Contact form: local-only feedback (no backend)
const form = document.getElementById('contact-form');
const feedback = document.getElementById('form-feedback');
if(form){
	form.addEventListener('submit', e=>{
		e.preventDefault();
		const data = new FormData(form);
		const name = data.get('name')?.toString().trim();
		const email = data.get('email')?.toString().trim();
		const message = data.get('message')?.toString().trim();
		if(!name || !email || !message){
			feedback.textContent = 'Please fill out all fields.';
			return;
		}
		feedback.textContent = 'Thanks — your message is ready to send (demo).';
		form.reset();
		setTimeout(()=> feedback.textContent = '', 4000);
	});
}

// Set current year in footer
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Accessibility: close nav if clicking outside (mobile)
document.addEventListener('click', e=>{
	if(!nav) return;
	if(!nav.classList.contains('open')) return;
	const withinNav = e.composedPath().includes(nav) || e.composedPath().includes(navToggle);
	if(!withinNav) nav.classList.remove('open');
});

// Reveal animations using IntersectionObserver
function setupReveals(){
	const items = document.querySelectorAll('[data-reveal]');
	if(!items.length) return;
	const io = new IntersectionObserver((entries, obs)=>{
		entries.forEach(entry=>{
			if(entry.isIntersecting){
				entry.target.classList.add('show');
				obs.unobserve(entry.target);
			}
		});
	},{threshold:0.12});
	items.forEach((el,i)=>{
		// stagger some items
		el.style.transitionDelay = (i * 80) + 'ms';
		io.observe(el);
	});
}
document.addEventListener('DOMContentLoaded', setupReveals);

