'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Briefcase,
  Building,
  GraduationCap,
  School,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import LandingHeader from '@/components/landing/header';
import LandingFooter from '@/components/landing/footer';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useUser } from '@/firebase';

const features = [
  {
    icon: <GraduationCap className="h-8 w-8 text-accent" />,
    title: 'For Students',
    description: 'Find your dream internship, build your profile, and connect with top companies in your field. Your career starts here.',
  },
  {
    icon: <School className="h-8 w-8 text-accent" />,
    title: 'For Schools',
    description: 'Easily verify student enrollments, track their progress, and build stronger relationships with industry partners.',
  },
  {
    icon: <Building className="h-8 w-8 text-accent" />,
    title: 'For Companies',
    description: 'Discover and recruit the best young talent. Post job openings, manage applications, and streamline your hiring process.',
  },
];

const steps = [
  {
    title: 'Sign Up',
    description: 'Create your account as a student, school, or company.',
  },
  {
    title: 'Get Verified',
    description: 'Complete your profile and undergo our verification process.',
  },
  {
    title: 'Find Matches',
    description: 'Browse opportunities or candidates that fit your needs.',
  },
  {
    title: 'Connect & Grow',
    description: 'Apply, interview, and start your professional journey.',
  },
];

const universities = [
    {
        name: 'University of the Philippines',
        description: 'A premier state university, offering a wide range of undergraduate and graduate programs.',
        logo: PlaceHolderImages.find(p => p.id === 'logo-up'),
        link: '#'
    },
    {
        name: 'Ateneo de Manila University',
        description: 'A private research university known for its liberal arts education and service-learning programs.',
        logo: PlaceHolderImages.find(p => p.id === 'logo-ateneo'),
        link: '#'
    },
    {
        name: 'De La Salle University',
        description: 'A Catholic research university renowned for its programs in business, engineering, and computer science.',
        logo: PlaceHolderImages.find(p => p.id === 'logo-dlsu'),
        link: '#'
    },
    {
        name: 'University of Santo Tomas',
        description: 'The oldest existing university in Asia, offering a rich tradition of academic excellence.',
        logo: PlaceHolderImages.find(p => p.id === 'logo-ust'),
        link: '#'
    }
];

const companies = [
    {
        name: 'San Miguel Corporation',
        description: 'One of the Philippines’ largest and most diversified conglomerates.',
        logo: PlaceHolderImages.find(p => p.id === 'logo-smc'),
        link: '#'
    },
    {
        name: 'Jollibee Foods Corporation',
        description: 'A multinational chain of fast food restaurants with a global presence.',
        logo: PlaceHolderImages.find(p => p.id === 'logo-jollibee'),
        link: '#'
    },
    {
        name: 'Ayala Corporation',
        description: 'The country\'s oldest and largest conglomerate with a diverse portfolio.',
        logo: PlaceHolderImages.find(p => p.id === 'logo-ayala'),
        link: '#'
    },
    {
        name: 'SM Investments',
        description: 'A leading conglomerate with interests in shopping mall development, retail, and more.',
        logo: PlaceHolderImages.find(p => p.id === 'logo-sm'),
        link: '#'
    }
];


export default function Home() {
  const { user, userData, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user && userData) {
       switch (userData.role) {
        case 'student':
          router.push('/student/dashboard');
          break;
        case 'school':
          router.push('/school/dashboard');
          break;
        case 'company':
          router.push('/company/dashboard');
          break;
        case 'admin':
          router.push('/admin/dashboard');
          break;
        default:
          break;
      }
    }
  }, [user, userData, isUserLoading, router]);

  if (isUserLoading || user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }


  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex min-h-screen flex-col">
      <LandingHeader />
      <main className="flex-1">
        <section className="relative w-full overflow-hidden bg-card pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 md:pb-24">
          <div className="container grid gap-8 px-4 md:grid-cols-2 md:px-6 lg:gap-16">
            <div className="flex flex-col items-start justify-center space-y-6">
              <h1 className="mt-8 font-headline text-4xl font-bold tracking-tight text-foreground sm:mt-0 sm:text-5xl md:text-6xl">
                Where Talent Meets Opportunity
              </h1>
              <p className="max-w-[600px] text-lg text-muted-foreground md:text-xl">
                interNet is the ultimate platform bridging the gap between
                ambitious students, forward-thinking schools, and innovative
                companies.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="shadow-lg">
                  <Link href="/signup">
                    Get Started Free <ArrowRight className="ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary" className="shadow-lg">
                  <Link href="/login">Explore Companies</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[300px] w-full md:h-auto">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="rounded-t-xl object-cover"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              )}
            </div>
          </div>
        </section>

        <section id="partners" className="bg-background py-12 md:py-24 lg:py-32">
            <div className="container">
                <div className="mb-12 text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                        Our University Partners
                    </h2>
                    <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                        Collaborating with leading institutions to foster student growth.
                    </p>
                </div>
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {universities.map((uni, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                          <Card className="h-full overflow-hidden transition-all duration-300">
                            <Link href={uni.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                                <div className="relative h-40 w-full">
                                {uni.logo && (
                                    <Image
                                    src={uni.logo.imageUrl}
                                    alt={`${uni.name} logo`}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={uni.logo.imageHint}
                                    />
                                )}
                                </div>
                                <CardContent className="p-6 text-left">
                                    <h3 className="font-headline text-lg font-semibold">{uni.name}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{uni.description}</p>
                                </CardContent>
                            </Link>
                          </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
            </div>
        </section>

        <section id="companies" className="bg-card py-12 md:py-24 lg:py-32">
            <div className="container">
                <div className="mb-12 text-center">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                        Featured Companies
                    </h2>
                    <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                        Top companies offering exciting internship opportunities.
                    </p>
                </div>
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-4">
                    {companies.map((company, index) => (
                      <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 pl-4">
                          <Card className="h-full overflow-hidden transition-all duration-300">
                            <Link href={company.link} target="_blank" rel="noopener noreferrer" className="block h-full">
                                <div className="relative h-40 w-full">
                                {company.logo && (
                                    <Image
                                    src={company.logo.imageUrl}
                                    alt={`${company.name} logo`}
                                    fill
                                    className="object-cover"
                                    data-ai-hint={company.logo.imageHint}
                                    />
                                )}
                                </div>
                                <CardContent className="p-6 text-left">
                                    <h3 className="font-headline text-lg font-semibold">{company.name}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{company.description}</p>
                                </CardContent>
                            </Link>
                          </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
            </div>
        </section>


        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                A Platform for Everyone
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Tailored features designed to meet the unique needs of students,
                schools, and companies.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map(feature => (
                <Card key={feature.title} className="flex flex-col shadow-md transition-transform duration-300 hover:-translate-y-2">
                  <CardHeader className="flex flex-row items-center gap-4">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full bg-card py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">
                Simple Steps to Success
              </h2>
              <p className="mx-auto mt-4 max-w-[700px] text-muted-foreground md:text-xl">
                Our streamlined process makes it easy to get started and achieve
                your goals.
              </p>
            </div>
            <div className="relative">
              <div className="absolute left-1/2 top-10 hidden h-[calc(100%-5rem)] w-0.5 -translate-x-1/2 bg-border md:block"></div>
              <div className="grid gap-12 md:grid-cols-2">
                {steps.map((step, index) => (
                  <div key={step.title} className={`flex items-start gap-6 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                    <div className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ${index % 2 === 1 ? 'md:ml-auto' : ''}`}>
                      <span className="text-xl font-bold">{index + 1}</span>
                    </div>
                    <div className={`text-left ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                      <h3 className="font-headline text-xl font-semibold">{step.title}</h3>
                      <p className="mt-1 text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="w-full bg-card py-16 md:py-24 lg:py-32">
          <div className="container text-center">
            <h2 className="font-headline text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground md:text-xl">
              Join thousands of students, schools, and companies already building
              their future with interNet.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="shadow-lg">
                <Link href="/signup">
                  Sign Up Now <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
