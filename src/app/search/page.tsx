import { AdvancedSearch } from '@/components/search/AdvancedSearch';

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream-500 to-white py-12">
      <div className="container mx-auto px-4">
        <AdvancedSearch />
      </div>
    </div>
  );
}