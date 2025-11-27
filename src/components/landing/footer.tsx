import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Github, Twitter, Linkedin } from 'lucide-react';

const socialLinks = [
  {
    name: 'Twitter',
    icon: <Twitter className="h-5 w-5" />,
    href: '#',
  },
  {
    name: 'GitHub',
    icon: <Github className="h-5 w-5" />,
    href: '#',
  },
  {
    name: 'LinkedIn',
    icon: <Linkedin className="h-5 w-5" />,
    href: '#',
  },
];

export default function LandingFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} interNet. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {socialLinks.map(social => (
              <Link
                key={social.name}
                href={social.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={social.name}
              >
                {social.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
