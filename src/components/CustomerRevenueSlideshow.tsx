import { useState, useEffect } from 'react';

interface Company {
  company_name: string;
  subscription: string | null;
}

interface CustomerRevenueSlideshowProps {
  companies: Company[];
}

export function CustomerRevenueSlideshow({ companies }: CustomerRevenueSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const companiesPerSlide = 3;
  const totalSlides = Math.ceil(companies.length / companiesPerSlide);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 2000);

    return () => clearInterval(timer);
  }, [totalSlides]);

  const getCurrentSlideCompanies = () => {
    const start = currentSlide * companiesPerSlide;
    return companies.slice(start, start + companiesPerSlide);
  };

  const formatSubscription = (subscription: string | null): string => {
    if (!subscription) return '$0';
    const num = parseFloat(subscription.replace(/[^0-9.-]+/g, ''));
    if (isNaN(num)) return '$0';
    if (num >= 1e9) return `$${Math.round(num / 1e9)}B`;
    if (num >= 1e6) return `$${Math.round(num / 1e6)}M`;
    if (num >= 1e3) return `$${Math.round(num / 1e3)}K`;
    return `$${Math.round(num)}`;
  };

  const totalSubscription = companies.reduce((sum, company) => {
    const subscription = parseFloat(company.subscription?.replace(/[^0-9.-]+/g, '') || '0');
    return sum + (isNaN(subscription) ? 0 : subscription);
  }, 0);

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 pt-6 pb-4">
        <h3 className="text-sm text-gray-600">Total Subscription</h3>
        <p className="text-2xl font-bold mt-2">${totalSubscription.toLocaleString()}</p>
      </div>
      
      <div className="flex-1 px-6">
        {getCurrentSlideCompanies().map((company, index) => (
          <div key={index} className="flex items-center justify-between mb-4 last:mb-0">
            <span className="text-sm font-medium truncate max-w-[160px]">
              {company.company_name}
            </span>
            <span className="text-sm font-medium ml-2">
              {formatSubscription(company.subscription)}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 pb-4">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              index === currentSlide ? 'bg-[#5B3CC4]' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}