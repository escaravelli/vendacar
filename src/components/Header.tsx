import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
      closeMenu();
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2 sm:py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}>
              ATR Automóveis
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavLink href="#about" isScrolled={isScrolled} onClick={handleNavClick}>
              Sobre
            </NavLink>
            <NavLink href="#vehicles" isScrolled={isScrolled} onClick={handleNavClick}>
              Veículos
            </NavLink>
            <NavLink href="#contact" isScrolled={isScrolled} onClick={handleNavClick}>
              Contato
            </NavLink>
            <Link 
              to="/dashadmin"
              className={`px-4 py-2 rounded-full transition-colors ${
                isScrolled
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-white text-primary hover:bg-gray-100'
              }`}
            >
              Área Administrativa
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-black/10 transition-colors"
            aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {isMenuOpen ? (
              <X className={isScrolled ? 'text-gray-900' : 'text-white'} size={24} />
            ) : (
              <Menu className={isScrolled ? 'text-gray-900' : 'text-white'} size={24} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden absolute left-0 right-0 top-full bg-white shadow-lg transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <nav className="flex flex-col py-4">
            <MobileNavLink href="#about" onClick={handleNavClick}>
              Sobre
            </MobileNavLink>
            <MobileNavLink href="#vehicles" onClick={handleNavClick}>
              Veículos
            </MobileNavLink>
            <MobileNavLink href="#contact" onClick={handleNavClick}>
              Contato
            </MobileNavLink>
            <Link
              to="/dashadmin"
              className="px-4 py-2 text-primary hover:bg-gray-50 transition-colors"
              onClick={closeMenu}
            >
              Área Administrativa
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function NavLink({ href, children, isScrolled, onClick }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`transition-colors font-medium ${
        isScrolled ? 'text-gray-900 hover:text-primary' : 'text-white hover:text-gray-200'
      }`}
    >
      {children}
    </a>
  );
}

interface MobileNavLinkProps {
  href: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}

function MobileNavLink({ href, onClick, children }: MobileNavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="px-4 py-2 text-gray-900 hover:bg-gray-50 transition-colors"
    >
      {children}
    </a>
  );
}