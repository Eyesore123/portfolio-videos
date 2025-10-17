import '../index.css';

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <div className="!mt-44 text-center !px-8 lg:!px-0">
      <h2 className="text-2xl font-bold gradienttext movingtext">{title}</h2>
      <p className="!mt-4 !px-2 text-lg text-gray-300">{subtitle}</p>
      <h3 className='sr-only'>{subtitle || ''}</h3>
    </div>
  );
}
