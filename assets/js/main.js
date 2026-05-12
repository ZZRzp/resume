/**
 * ================================================
 * 个人作品集网站 - 终极优化 JavaScript 文件
 * 作者：曾子荣
 * ================================================
 */

const log = (message, type = 'log') => {
    const colors = { log: '#6FFF00', warn: '#FFA500', error: '#FF4444' };
    console[type](`%c[ZENG] ${message}`, `color: ${colors[type]}`);
};

const handleError = (error, context) => { log(`[${context}] 错误: ${error.message}`, 'error'); };

const throttle = (func, limit = 300) => {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

const LoaderModule = (() => {
    const init = () => {
        try {
            const loader = document.getElementById('loader');
            if (loader) {
                setTimeout(() => {
                    loader.style.opacity = '0';
                    setTimeout(() => loader.style.display = 'none', 500);
                }, 800);
            }
        } catch (error) { handleError(error, 'LoaderModule'); }
    };
    return { init };
})();

const ScrollRevealModule = (() => {
    const init = () => {
        try {
            const reveals = document.querySelectorAll('.reveal');
            const revealOnScroll = () => {
                const windowHeight = window.innerHeight;
                reveals.forEach(reveal => {
                    const revealTop = reveal.getBoundingClientRect().top;
                    if (revealTop < windowHeight - 100) reveal.classList.add('active');
                });
            };
            revealOnScroll();
            window.addEventListener('scroll', throttle(revealOnScroll, 100));
        } catch (error) { handleError(error, 'ScrollRevealModule'); }
    };
    return { init };
})();

// ★ 终极修复：完美导航高亮控制（解决双下划线、乱跳、停顿Bug）
const NavActiveModule = (() => {
    const init = () => {
        try {
            const navLinks = document.querySelectorAll('.nav-link');
            const navMenu = document.getElementById('navMenu');
            let isAutoScrolling = false;
            let scrollTimeout;

            const setActiveNav = (targetId) => {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${targetId}` || (targetId === 'hero' && href === '#')) {
                        link.classList.add('active');
                    }
                });
            };

            const updateActiveOnScroll = throttle(() => {
                if (isAutoScrolling) return;

                const sections = ['hero', 'about', 'skills', 'experience', 'portfolio', 'contact'];
                let currentSection = 'hero';

                sections.forEach(sectionId => {
                    const section = document.getElementById(sectionId);
                    if (section) {
                        const rect = section.getBoundingClientRect();
                        if (rect.top <= 120 && rect.bottom > 120) {
                            currentSection = sectionId;
                        }
                    }
                });

                setActiveNav(currentSection);
            }, 100);

            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();

                    const href = link.getAttribute('href');
                    const targetId = href === '#' ? 'hero' : href.substring(1);
                    const targetSection = document.getElementById(targetId);

                    setActiveNav(targetId);
                    navMenu.classList.remove('active');
                    isAutoScrolling = true;

                    if (href === '#') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (targetSection) {
                        targetSection.scrollIntoView({ behavior: 'smooth' });
                    }

                    clearTimeout(scrollTimeout);
                    scrollTimeout = setTimeout(() => {
                        isAutoScrolling = false;
                    }, 800);
                });
            });

            window.addEventListener('scroll', updateActiveOnScroll);
            log('导航栏状态锁模块初始化完成');
        } catch (error) {
            handleError(error, 'NavActiveModule');
        }
    };
    return { init };
})();

const MobileMenuModule = (() => {
    const init = () => {
        try {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('navMenu');
            if (hamburger && navMenu) {
                hamburger.addEventListener('click', () => {
                    navMenu.classList.toggle('active');
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fa-bars');
                        icon.classList.toggle('fa-times');
                    }
                });
            }
        } catch (error) { handleError(error, 'MobileMenuModule'); }
    };
    return { init };
})();

const HeroParticlesModule = (() => {
    const init = () => {
        try {
            const container = document.querySelector('.particles');
            if (container) {
                for (let i = 0; i < 20; i++) {
                    const p = document.createElement('div');
                    p.className = 'particle';
                    p.style.left = `${Math.random() * 100}%`;
                    p.style.top = `${Math.random() * 100}%`;
                    const size = Math.random() * 4 + 2;
                    p.style.width = `${size}px`; p.style.height = `${size}px`;
                    p.style.animation = `float ${Math.random() * 3 + 4}s ease-in-out infinite`;
                    p.style.animationDelay = `${Math.random() * 5}s`;
                    container.appendChild(p);
                }
                const style = document.createElement('style');
                style.textContent = `@keyframes float { 0%, 100% { transform: translateY(0); opacity: 0; } 50% { opacity: 0.5; } 100% { transform: translateY(-100px); opacity: 0; } }`;
                document.head.appendChild(style);
            }
        } catch (error) { handleError(error, 'HeroParticlesModule'); }
    };
    return { init };
})();

const CursorGlowModule = (() => {
    const init = () => {
        try {
            const cursorGlow = document.querySelector('.cursor-glow');
            if (cursorGlow) {
                let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
                document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
                const animate = () => {
                    glowX += (mouseX - glowX) * 0.1; glowY += (mouseY - glowY) * 0.1;
                    cursorGlow.style.left = `${glowX}px`; cursorGlow.style.top = `${glowY}px`;
                    requestAnimationFrame(animate);
                };
                animate();
            }
        } catch (error) { handleError(error, 'CursorGlowModule'); }
    };
    return { init };
})();

const LazyLoadingModule = (() => {
    const init = () => {
        try {
            const lazyImages = document.querySelectorAll('.lazy-image');
            if ('IntersectionObserver' in window) {
                const observer = new IntersectionObserver((entries, obs) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.getAttribute('data-src');
                            img.onload = () => img.style.opacity = '1';
                            obs.unobserve(img);
                        }
                    });
                }, { rootMargin: '300px' });
                lazyImages.forEach(img => observer.observe(img));
            } else {
                lazyImages.forEach(img => { img.src = img.getAttribute('data-src'); img.style.opacity = '1'; });
            }
        } catch (error) { handleError(error, 'LazyLoadingModule'); }
    };
    return { init };
})();

const BackToTopModule = (() => {
    const init = () => {
        try {
            const btn = document.getElementById('backToTop');
            if (btn) {
                window.addEventListener('scroll', throttle(() => {
                    if (window.scrollY > 500) {
                        btn.style.opacity = '1'; btn.style.visibility = 'visible';
                    } else {
                        btn.style.opacity = '0'; btn.style.visibility = 'hidden';
                    }
                }, 200));
                btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
            }
        } catch (error) { handleError(error, 'BackToTopModule'); }
    };
    return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
    [LoaderModule, ScrollRevealModule, NavActiveModule, MobileMenuModule, HeroParticlesModule, CursorGlowModule, LazyLoadingModule, BackToTopModule].forEach(m => m.init());
});