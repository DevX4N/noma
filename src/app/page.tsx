import { Categories } from '@/components/home/categories';
import { Editorial } from '@/components/home/editorial';
import { Hero } from '@/components/home/hero';
import { JournalSection } from '@/components/home/journal-section';
import { Manifesto } from '@/components/home/manifesto';
import { NewArrivals } from '@/components/home/new-arrivals';
import { Signature } from '@/components/home/signature';

export default function Home() {
  return (
    <>
      <Hero />
      <NewArrivals />
      <Editorial />
      <Categories />
      <Signature />
      <Manifesto />
      <JournalSection />
    </>
  );
}
