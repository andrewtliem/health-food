-- Seed Data for Eden Healthy Market

-- Categories
INSERT INTO categories (id, name, slug, icon, description) VALUES
('cat-grains', 'Whole Grains & Oats', 'whole-grains', 'Wheat', 'Nutrient-rich ancient grains, rolled oats, and gluten-free seeds'),
('cat-veg', 'Vegetarian & Plant Pantry', 'vegetarian-pantry', 'Utensils', 'Plant-based meat substitutes, artisan tempeh, nutritional yeast & wholesome staples'),
('cat-snacks', 'Granola & Healthy Snacks', 'granola-snacks', 'Sparkles', 'Slow-baked artisan granola, roasted nut blends, and dried superfruits'),
('cat-drinks', 'Plant-Based Drinks', 'plant-drinks', 'Coffee', 'Fresh oat milk, almond milk, cold-pressed green elixirs & kombucha'),
('cat-produce', 'Fresh Organic Produce', 'fresh-produce', 'Apple', 'Locally sourced pesticide-free greens, heirloom vegetables, and farm fruits'),
('cat-bundles', 'Curated Bundles', 'bundles', 'Package', 'Thoughtfully paired bundles for weekly wellness and breakfast routines');

-- Dietary Tags
INSERT INTO dietary_tags (id, name, slug, badge_color) VALUES
('tag-vegan', '100% Vegan', 'vegan', 'bg-emerald-100 text-emerald-800 border-emerald-300'),
('tag-gf', 'Gluten-Free', 'gluten-free', 'bg-amber-100 text-amber-800 border-amber-300'),
('tag-organic', 'Certified Organic', 'organic', 'bg-green-100 text-green-800 border-green-300'),
('tag-sugarfree', 'No Added Sugar', 'sugar-free', 'bg-sky-100 text-sky-800 border-sky-300'),
('tag-local', 'Local Farm Direct', 'local', 'bg-teal-100 text-teal-800 border-teal-300'),
('tag-protein', 'High Protein', 'high-protein', 'bg-purple-100 text-purple-800 border-purple-300');

-- Products (Prices in Indonesian Rupiah IDR)
INSERT INTO products (id, name, slug, description, category_id, price, unit, stock_quantity, image_url, origin, ingredients, allergens, nutritional_highlights, is_featured, is_bundle) VALUES
(
  'prod-1',
  'Organic Rolled Oats (Jumbo Size)',
  'organic-rolled-oats-1kg',
  'Certified organic thick-cut rolled oats sourced from cool climate highland farms. Perfect for creamy oatmeal, overnight oats, and baking.',
  'cat-grains',
  65000,
  '1 kg',
  42,
  'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
  'Highland Australian Organic Farms',
  '100% Certified Organic Whole Grain Rolled Oats',
  'May contain traces of gluten from shared milling facilities.',
  'Rich in Beta-Glucan soluble fiber (5g per serving), 12g Plant Protein, Zero Sodium.',
  1,
  0
),
(
  'prod-2',
  'Dark Chocolate Hazelnut Granola',
  'dark-chocolate-hazelnut-granola',
  'Handmade in small batches, lightly sweetened with pure coconut nectar, loaded with roasted hazelnuts, raw cacao nibs, and organic pumpkin seeds.',
  'cat-snacks',
  78000,
  '350 g',
  16,
  'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80',
  'Eden Kitchen In-House Bakery',
  'Gluten-Free Oats, Raw Cacao Nibs, Roasted Hazelnuts, Coconut Nectar, Pumpkin Seeds, Cold-Pressed Coconut Oil, Sea Salt',
  'Contains Tree Nuts (Hazelnuts).',
  'Iron (15% DV), Magnesium (25% DV), 6g Fiber per serving.',
  1,
  0
),
(
  'prod-3',
  'Barista Blend Creamy Oat Milk',
  'barista-blend-creamy-oat-milk',
  'Ultra-smooth, steamable plant milk formulated specifically for matcha, specialty coffee, and cereal without any chalky residue.',
  'cat-drinks',
  48000,
  '1 Liter',
  5, -- Low stock demonstration!
  'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  'Eden Plant Dairy Collective',
  'Spring Water, Whole Grain Rolled Oats (12%), Cold-Pressed Sunflower Oil, Sea Salt, Dipotassium Phosphate (acidity regulator)',
  'None. Free from dairy, nuts, and soy.',
  'Enriched with Calcium (120mg), Vitamin D2 & B12. No refined sugars.',
  1,
  0
),
(
  'prod-4',
  'Organic Tri-Color Quinoa',
  'organic-tri-color-quinoa',
  'A vibrant mix of white, red, and black royal Andean quinoa. Fluffy texture with a nutty aroma, ideal for grain bowls and high-protein vegetarian lunches.',
  'cat-grains',
  85000,
  '500 g',
  28,
  'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
  'Bolivian Highlands (Fair Trade Certified)',
  '100% Organic White, Red, and Black Quinoa Grains',
  'Gluten-Free. Processed in an allergen-controlled facility.',
  'Complete protein profile (all 9 essential amino acids), 14g Protein per 100g, low GI.',
  0,
  0
),
(
  'prod-5',
  'Artisan Heritage Non-GMO Tempeh Block',
  'artisan-heritage-tempeh-block',
  'Naturally fermented whole soybeans using traditional starter cultures, banana-leaf wrapped for maximum umami and aroma.',
  'cat-veg',
  24000,
  '350 g',
  18,
  'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'Central Java Heritage Cooperative',
  'Certified Non-GMO Soybeans, Rhizopus Oligosporus Culture, Water, Natural Banana Leaf wrapper',
  'Contains Soy.',
  '19g Bioavailable Protein, Active prebiotics & probiotics, High Isoflavones.',
  1,
  0
),
(
  'prod-6',
  'Raw Organic Chia Seeds',
  'raw-organic-chia-seeds',
  'Pure black chia seeds packed with plant-based Omega-3 fatty acids. Creates nourishing puddings and acts as an egg-replacer for vegan baking.',
  'cat-grains',
  55000,
  '250 g',
  35,
  'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?auto=format&fit=crop&w=800&q=80',
  'South American Organic Growers',
  '100% Organic Black Salvia Hispanica Seeds',
  'None.',
  '4915mg Omega-3 ALA per 25g, 10g Dietary Fiber, High Calcium.',
  0,
  0
),
(
  'prod-7',
  'Raw Almond Milk (Unsweetened Cold-Pressed)',
  'raw-almond-milk-unsweetened',
  'Activated Californian almonds cold-pressed with pure filtered mountain water. Clean, light, and free from thickeners or emulsifiers.',
  'cat-drinks',
  52000,
  '1 Liter',
  3, -- Low stock alert
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  'Eden Cold-Pressed Kitchen',
  'Filtered Mountain Spring Water, Activated Raw Almonds (14%), Himalayan Pink Salt',
  'Contains Tree Nuts (Almonds).',
  'Only 35 calories per 100ml, rich in Vitamin E antioxidants, zero cholesterol.',
  0,
  0
),
(
  'prod-8',
  'Savory Nutritional Yeast Flakes (Nooch)',
  'savory-nutritional-yeast-flakes',
  'Deactivated primary yeast with a rich, cheesy, nutty flavor. The quintessential vegan secret weapon for dairy-free cheese sauces, pastas, and popcorn.',
  'cat-veg',
  72000,
  '200 g',
  22,
  'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=800&q=80',
  'European Fermentation Labs',
  'Dried Inactive Yeast (Saccharomyces Cerevisiae), Fortified with B-Complex Vitamins (B1, B2, B3, B6, B12, Folic Acid)',
  'Gluten-Free, Dairy-Free, Soy-Free.',
  '8g Protein in 2 tablespoons, 300% Daily Value of Vitamin B12 for vegan vitality.',
  1,
  0
),
(
  'prod-9',
  'Wildflower Honey & Roasted Almond Granola',
  'honey-almond-granola',
  'Crunchy clusters of gluten-free rolled oats kissed with sustainably harvested forest honey, golden flaxseeds, and toasted California almonds.',
  'cat-snacks',
  72000,
  '350 g',
  19,
  'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
  'Eden Kitchen In-House Bakery',
  'Rolled Oats, Pure Wildflower Forest Honey, Toasted Almonds, Flaxseeds, Coconut Oil, Vanilla Bean Extract, Sea Salt',
  'Contains Tree Nuts (Almonds). Vegetarian (Contains Honey).',
  '7g Protein, 4g Dietary Fiber, naturally energizing clean carbs.',
  0,
  0
),
(
  'prod-10',
  'Organic Tuscan Baby Kale (Crisp Greens)',
  'organic-tuscan-baby-kale',
  'Tender, sweet dinosaur kale hand-harvested this morning from our regenerative partner farm in Lembang highland. Crisp and packed with antioxidants.',
  'cat-produce',
  28000,
  '250 g',
  14,
  'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&w=800&q=80',
  'Lembang Highland Eco Farm (Zero Pesticides)',
  '100% Farm-Fresh Pesticide-Free Lacinato Baby Kale',
  'None.',
  'Over 200% DV of Vitamin K, Vitamin A and Vitamin C. Harvested daily at dawn.',
  1,
  0
),
(
  'prod-11',
  'Heirloom Rainbow Cherry Tomatoes',
  'heirloom-rainbow-cherry-tomatoes',
  'Vine-ripened mix of ruby, gold, and chocolate cherry tomatoes. Bursting with sweet, tangy natural juice. No chemical sprays.',
  'cat-produce',
  34000,
  '300 g',
  9,
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  'Puncak Valley Organic Polytunnel',
  '100% Organic Heirloom Tomatoes',
  'None.',
  'High in Lycopene, Vitamin C, and natural potassium.',
  0,
  0
),
(
  'prod-12',
  'Organic Cold-Pressed Extra Virgin Olive Oil',
  'organic-cold-pressed-olive-oil',
  'Single-estate unrefined first cold press olive oil with an herbaceous aroma and peppery finish. High polyphenols.',
  'cat-veg',
  165000,
  '500 ml',
  12,
  'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
  'Peloponnese Certified Estate, Greece',
  '100% Extra Virgin Cold-Pressed Olive Oil',
  'None.',
  'Rich in Monounsaturated Oleic Acid and Oleocanthal antioxidants.',
  0,
  0
),
(
  'prod-13',
  'Crispy Baked Seaweed & White Sesame Strips',
  'crispy-seaweed-sesame-strips',
  'Double-sheeted Korean nori seaweed sandwiched with roasted white sesame seeds and slow-baked without any palm oil or MSG.',
  'cat-snacks',
  32000,
  '60 g',
  40,
  'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
  'Wando Clean Ocean Waters, South Korea',
  'Dried Laver Seaweed (65%), Roasted White Sesame (25%), Soy Sauce (Non-GMO), Organic Cane Sugar, Rice Malt',
  'Contains Soy and Sesame.',
  'Natural Iodine, Vitamin A, Calcium, and Iron. Zero trans fats.',
  0,
  0
),
(
  'prod-14',
  'Sparkling Raw Ginger Turmeric Kombucha',
  'sparkling-ginger-turmeric-kombucha',
  'Naturally carbonated probiotic brew fermented with green tea, wild forest honey, freshly juiced local red ginger, and mountain turmeric.',
  'cat-drinks',
  38000,
  '330 ml',
  24,
  'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
  'Eden Fermentation Cellar',
  'Organic Green Tea, Raw SCOBY, Purified Water, Cane Sugar (consumed during fermentation), Fresh Red Ginger Juice, Cold-Pressed Turmeric',
  'Living probiotic beverage. Handle with care, keep chilled.',
  'Billion CFU live gut probiotics, Acetic Acid, Glucuronic Acid for detox support.',
  1,
  0
),
(
  'prod-15',
  'Organic Hass Avocados (Butter Texture)',
  'organic-hass-avocados',
  'Creamy, buttery Hass avocados grown in rich volcanic mountain soil. Ripened to perfection, ideal for guacamole, salads, and morning toast.',
  'cat-produce',
  45000,
  '500 g (2-3 pcs)',
  11,
  'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
  'Dieng Volcanic Highlands',
  '100% Tree-Ripened Hass Avocados',
  'None.',
  'Healthy Monounsaturated Fatty Acids (Oleic Acid), Potassium, Folate.',
  0,
  0
),
(
  'prod-16',
  'The Sunrise Wellness Breakfast Bundle',
  'sunrise-wellness-breakfast-bundle',
  'Our most popular morning routine starter kit: Includes 1kg Organic Rolled Oats, 1L Barista Oat Milk, and 350g Dark Chocolate Hazelnut Granola. Save 15% vs individual items!',
  'cat-bundles',
  162000,
  'Bundle (3 items)',
  15,
  'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  'Eden Curated Wellness Kitchen',
  '1kg Organic Oats + 1L Barista Oat Milk + 350g Dark Choc Granola',
  'Contains Tree Nuts (Hazelnuts). Dairy-Free & Vegan.',
  'Full daily supply of dietary fiber, complex carbohydrates, and plant protein.',
  1,
  1
),
(
  'prod-17',
  'Farm-to-Door Weekly Organic Veggie Box',
  'farm-to-door-weekly-veggie-box',
  'A vibrant farm box featuring 5 freshly picked seasonal greens and vegetables (Baby Kale, Rainbow Cherry Tomatoes, Romaine Lettuce, Japanese Cucumbers, and Sweet Baby Carrots).',
  'cat-bundles',
  125000,
  'Box (Approx 2 kg)',
  8,
  'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&w=800&q=80',
  'Lembang & Puncak Regenerative Farm Partners',
  'Rotating seasonal pesticide-free local produce harvested within 12 hours of delivery',
  'None.',
  'Maximum phytonutrient density, farm-fresh vitamins, 100% local supporting small farmers.',
  1,
  1
);

-- Map Product Dietary Tags
-- prod-1: Oats -> Vegan, GF, Organic, Sugar-Free
INSERT INTO product_dietary_tags VALUES ('prod-1', 'tag-vegan'), ('prod-1', 'tag-gf'), ('prod-1', 'tag-organic'), ('prod-1', 'tag-sugarfree');

-- prod-2: Granola -> Vegan, GF, Sugar-Free
INSERT INTO product_dietary_tags VALUES ('prod-2', 'tag-vegan'), ('prod-2', 'tag-gf'), ('prod-2', 'tag-sugarfree');

-- prod-3: Oat Milk -> Vegan, Sugar-Free
INSERT INTO product_dietary_tags VALUES ('prod-3', 'tag-vegan'), ('prod-3', 'tag-sugarfree');

-- prod-4: Quinoa -> Vegan, GF, Organic, High Protein
INSERT INTO product_dietary_tags VALUES ('prod-4', 'tag-vegan'), ('prod-4', 'tag-gf'), ('prod-4', 'tag-organic'), ('prod-4', 'tag-protein');

-- prod-5: Tempeh -> Vegan, GF, Local, High Protein
INSERT INTO product_dietary_tags VALUES ('prod-5', 'tag-vegan'), ('prod-5', 'tag-gf'), ('prod-5', 'tag-local'), ('prod-5', 'tag-protein');

-- prod-6: Chia -> Vegan, GF, Organic, Sugar-Free
INSERT INTO product_dietary_tags VALUES ('prod-6', 'tag-vegan'), ('prod-6', 'tag-gf'), ('prod-6', 'tag-organic'), ('prod-6', 'tag-sugarfree');

-- prod-7: Almond Milk -> Vegan, GF, Sugar-Free
INSERT INTO product_dietary_tags VALUES ('prod-7', 'tag-vegan'), ('prod-7', 'tag-gf'), ('prod-7', 'tag-sugarfree');

-- prod-8: Nooch -> Vegan, GF, High Protein
INSERT INTO product_dietary_tags VALUES ('prod-8', 'tag-vegan'), ('prod-8', 'tag-gf'), ('prod-8', 'tag-protein');

-- prod-9: Honey Granola -> GF
INSERT INTO product_dietary_tags VALUES ('prod-9', 'tag-gf');

-- prod-10: Kale -> Vegan, GF, Organic, Local
INSERT INTO product_dietary_tags VALUES ('prod-10', 'tag-vegan'), ('prod-10', 'tag-gf'), ('prod-10', 'tag-organic'), ('prod-10', 'tag-local');

-- prod-11: Tomatoes -> Vegan, GF, Organic, Local
INSERT INTO product_dietary_tags VALUES ('prod-11', 'tag-vegan'), ('prod-11', 'tag-gf'), ('prod-11', 'tag-organic'), ('prod-11', 'tag-local');

-- prod-12: Olive Oil -> Vegan, GF, Organic
INSERT INTO product_dietary_tags VALUES ('prod-12', 'tag-vegan'), ('prod-12', 'tag-gf'), ('prod-12', 'tag-organic');

-- prod-13: Seaweed -> Vegan
INSERT INTO product_dietary_tags VALUES ('prod-13', 'tag-vegan');

-- prod-14: Kombucha -> Vegan, GF, Local
INSERT INTO product_dietary_tags VALUES ('prod-14', 'tag-vegan'), ('prod-14', 'tag-gf'), ('prod-14', 'tag-local');

-- prod-15: Avocados -> Vegan, GF, Organic, Local
INSERT INTO product_dietary_tags VALUES ('prod-15', 'tag-vegan'), ('prod-15', 'tag-gf'), ('prod-15', 'tag-organic'), ('prod-15', 'tag-local');

-- prod-16: Breakfast Bundle -> Vegan
INSERT INTO product_dietary_tags VALUES ('prod-16', 'tag-vegan');

-- prod-17: Veggie Box -> Vegan, GF, Organic, Local
INSERT INTO product_dietary_tags VALUES ('prod-17', 'tag-vegan'), ('prod-17', 'tag-gf'), ('prod-17', 'tag-organic'), ('prod-17', 'tag-local');
