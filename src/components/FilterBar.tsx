import React from 'react';
import { 
  Store, 
  Wheat, 
  Utensils, 
  Sparkles, 
  Coffee, 
  Apple, 
  Package, 
  Check, 
  SlidersHorizontal 
} from 'lucide-react';
import { Category, DietaryTag } from '../types';

interface FilterBarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  dietaryTags: DietaryTag[];
  selectedDietary: string;
  onSelectDietary: (slug: string) => void;
  inStockOnly: boolean;
  onToggleInStockOnly: (val: boolean) => void;
  totalFilteredCount: number;
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
  Store,
  Wheat,
  Utensils,
  Sparkles,
  Coffee,
  Apple,
  Package,
};

export const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  dietaryTags,
  selectedDietary,
  onSelectDietary,
  inStockOnly,
  onToggleInStockOnly,
  totalFilteredCount,
}) => {
  return (
    <div className="bg-white border-b border-oat-200 sticky top-16 sm:top-18 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 space-y-3">
        
        {/* Category Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const Icon = CATEGORY_ICON_MAP[cat.icon] || Store;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-eden-700 text-white shadow-xs'
                    : 'bg-oat-50 text-stone-700 hover:bg-oat-100 hover:text-stone-900 border border-oat-200/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-eden-200' : 'text-stone-500'}`} />
                <span>{cat.name}</span>
                {typeof cat.productCount === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-eden-800 text-eden-100' : 'bg-stone-200/80 text-stone-600'
                    }`}
                  >
                    {cat.productCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Second Row: Dietary Filter Chips & In-Stock Only Switch */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-oat-100">
          
          {/* Dietary Tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              Diet:
            </span>

            <button
              onClick={() => onSelectDietary('all')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                selectedDietary === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Diets
            </button>

            {dietaryTags.map((tag) => {
              const isSelected = selectedDietary === tag.slug;
              return (
                <button
                  key={tag.id}
                  onClick={() => onSelectDietary(isSelected ? 'all' : tag.slug)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border transition ${
                    isSelected
                      ? 'bg-eden-600 text-white border-eden-600'
                      : `${tag.badge_color} hover:opacity-85`
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{tag.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: In Stock Only & Result Counter */}
          <div className="flex items-center gap-4 ml-auto">
            {/* Live Stock Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => onToggleInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-600 relative"></div>
              <span className="text-xs font-medium text-stone-700">
                In Stock Only
              </span>
            </label>

            {/* Results Count */}
            <span className="text-xs text-stone-400 hidden sm:inline">
              Showing <strong className="text-stone-800">{totalFilteredCount}</strong> items
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
