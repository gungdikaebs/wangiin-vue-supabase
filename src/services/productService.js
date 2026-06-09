import { supabase } from '../plugins/supabase'

const mockProducts = [
  {
    id: 'A-01',
    name: 'SILICON OUD',
    brand: 'Wangiin Signature',
    classification: 'Niche',
    category: 'Woody',
    type: 'EAU DE PARFUM',
    price_2ml: 45000,
    price_5ml: 85000,
    price_10ml: 150000,
    notes: 'ALDEHYDES / BLACK TEA / VETIVER',
    top_notes: 'Aldehydes, Bergamot, Pink Pepper',
    middle_notes: 'Black Tea, Iris, Guaiac Wood',
    base_notes: 'Vetiver, Oud, Musk',
    description: 'A modern, metallic take on traditional oud. Silicon Oud blends the sharp, synthetic clarity of aldehydes with the deep, grounding resonance of aged wood and vetiver. Perfect for formal evenings and sharp suits.',
    isNew: true,
    isFeatured: true,
  },
  {
    id: 'C-04',
    name: 'CARBON IRIS',
    brand: 'Wangiin Signature',
    classification: 'Designer',
    category: 'Floral',
    type: 'EXTRAIT DE PARFUM',
    price_2ml: 65000,
    price_5ml: 120000,
    price_10ml: 220000,
    notes: 'IRIS PALLIDA / AMBROXAN / MUSK',
    top_notes: 'Juniper Berries, Cypress',
    middle_notes: 'Iris Pallida, Violet Leaf',
    base_notes: 'Ambroxan, White Musk, Cedarwood',
    description: 'An extremely luxurious and dense floral arrangement, grounded by molecular ambroxan. Carbon Iris feels like slipping on a tailored velvet jacket—soft, powdery, yet undeniably powerful.',
    isNew: false,
    isFeatured: true,
  },
  {
    id: 'N-09',
    name: 'NEON BERGAMOT',
    brand: 'Wangiin Signature',
    classification: 'Local',
    category: 'Fresh',
    type: 'EAU DE PARFUM',
    price_2ml: 50000,
    price_5ml: 95000,
    price_10ml: 180000,
    notes: 'BERGAMOT / YUZU / OAKMOSS',
    top_notes: 'Calabrian Bergamot, Yuzu, Grapefruit',
    middle_notes: 'Neroli, Jasmine Tea',
    base_notes: 'Oakmoss, Vetiver',
    description: 'A vibrant, electrifying citrus burst. Neon Bergamot is designed to cut through the heat with an intensely refreshing blast of yuzu and bergamot, drying down into a sophisticated, earthy oakmoss base.',
    isNew: false,
    isFeatured: true,
  },
  {
    id: 'S-02',
    name: 'VANILLA STATIC',
    brand: 'Wangiin Signature',
    classification: 'Niche',
    category: 'Sweet',
    type: 'EAU DE PARFUM',
    price_2ml: 55000,
    price_5ml: 100000,
    price_10ml: 190000,
    notes: 'MADAGASCAR VANILLA / TONKA / BURNT SUGAR',
    top_notes: 'Burnt Sugar, Almond',
    middle_notes: 'Tonka Bean, Caramel',
    base_notes: 'Madagascar Vanilla Absolute, Amber',
    description: 'Not your typical bakery vanilla. Vanilla Static introduces a slightly charred, smoky edge to gourmand sweetness, making it a highly addictive, grown-up dessert fragrance.',
    isNew: true,
    isFeatured: false,
  },
  {
    id: 'F-07',
    name: 'GHOST JASMINE',
    brand: 'Wangiin Signature',
    classification: 'Middle Eastern',
    category: 'Floral',
    type: 'EAU DE PARFUM',
    price_2ml: 50000,
    price_5ml: 95000,
    price_10ml: 180000,
    notes: 'JASMINE SAMBAC / PETRICHOR / MUSK',
    top_notes: 'Petrichor, Bergamot',
    middle_notes: 'Jasmine Sambac, Lily of the Valley',
    base_notes: 'White Musk, Cashmeran',
    description: 'The smell of a garden just after a heavy midnight rain. Ghost Jasmine captures the hauntingly beautiful scent of wet concrete and blooming jasmine in the dark.',
    isNew: false,
    isFeatured: false,
  },
  {
    id: 'W-11',
    name: 'SANTAL GLITCH',
    brand: 'HMNS',
    classification: 'Local',
    category: 'Woody',
    type: 'EXTRAIT DE PARFUM',
    price_2ml: 70000,
    price_5ml: 130000,
    price_10ml: 240000,
    notes: 'SANDALWOOD / CARDAMOM / LEATHER',
    top_notes: 'Cardamom, Violet, Papyrus',
    middle_notes: 'Iris, Leather',
    base_notes: 'Australian Sandalwood, Cedarwood, Amber',
    description: 'A creamy, dry, and smoky sandalwood fragrance that feels instantly iconic. Santal Glitch envelopes you in a comforting yet mysterious aura of leather and spice.',
    isNew: false,
    isFeatured: false,
  },
  {
    id: 'R-05',
    name: 'SYNTHETIC ROSE',
    brand: 'Afnan',
    classification: 'Middle Eastern',
    category: 'Floral',
    type: 'EAU DE PARFUM',
    price_2ml: 55000,
    price_5ml: 100000,
    price_10ml: 190000,
    notes: 'BULGARIAN ROSE / METALLIC NOTES / PATCHOULI',
    top_notes: 'Pink Pepper, Metallic Notes',
    middle_notes: 'Bulgarian Rose, Geranium',
    base_notes: 'Patchouli, Frankincense',
    description: 'A cold, razor-sharp interpretation of the classic rose. Piercing metallic notes slice through the rich, jammy floral middle, resting on a dark patchouli base.',
    isNew: true,
    isFeatured: false,
  },
  {
    id: 'M-08',
    name: 'OZONE LEATHER',
    brand: 'Mykonos',
    classification: 'Local',
    category: 'Woody',
    type: 'EAU DE PARFUM',
    price_2ml: 60000,
    price_5ml: 110000,
    price_10ml: 200000,
    notes: 'OZONE / TUSCAN LEATHER / SAFFRON',
    top_notes: 'Ozone, Raspberry',
    middle_notes: 'Saffron, Thyme, Jasmine',
    base_notes: 'Tuscan Leather, Suede, Amber',
    description: 'The scent of a brand new luxury car interior, driven by the coast. Ozone Leather balances the heavy, animalic punch of leather with a surprisingly airy, fresh top note.',
    isNew: false,
    isFeatured: false,
  }
]

export const productService = {
  /**
   * Fetch all products from Supabase
   */
  async getProducts({ category = null, brand = null, classification = null, search = '', page = 1, limit = 6 } = {}) {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          brand:brands!inner(id, name, classification),
          categories!inner(id, name),
          variants:product_variants(id, size, price, stock)
        `, { count: 'exact' })

      if (category && category !== 'All') {
        query = query.eq('categories.name', category)
      }

      if (brand && brand !== 'All') {
        query = query.eq('brand.name', brand)
      }

      if (classification && classification !== 'All') {
        query = query.eq('brand.classification', classification)
      }

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
      }

      // Pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, count, error } = await query

      if (error) throw error

      // Transform data to match our frontend UI expectations
      const transformed = data.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand?.name || 'Unknown Brand',
        brand_id: p.brand?.id || null,
        classification: p.brand?.classification || 'Local',
        category: p.categories?.map(c => c.name).join(', ') || 'Uncategorized',
        categoryList: p.categories?.map(c => c.name) || [],
        subtitle: p.subtitle,
        description: p.description,
        image_url: p.image_url,
        notes: {
          top: p.top_notes,
          middle: p.middle_notes,
          base: p.base_notes
        },
        isNew: p.is_new,
        variants: p.variants || [],
        price_2ml: p.variants?.find(v => v.size === '2 ML')?.price || 0,
        price_5ml: p.variants?.find(v => v.size === '5 ML')?.price || 0,
        price_10ml: p.variants?.find(v => v.size === '10 ML')?.price || 0,
      }))

      return {
        data: transformed,
        meta: {
          total: count || 0,
          page,
          lastPage: Math.ceil((count || 0) / limit)
        }
      }
    } catch (err) {
      console.error('Error fetching products:', err)
      return { data: [], meta: { total: 0, page: 1, lastPage: 1 } }
    }
  },

  /**
   * Fetch a single product by ID
   */
  async getProductById(id) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          brand:brands(id, name, classification),
          categories(id, name),
          variants:product_variants(id, size, price, stock)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (!data) return null

      return {
        id: data.id,
        name: data.name,
        brand: data.brand?.name || 'Unknown Brand',
        brand_id: data.brand?.id || null,
        classification: data.brand?.classification || 'Local',
        category: data.categories?.map(c => c.name).join(', ') || 'Uncategorized',
        categoryList: data.categories?.map(c => c.name) || [],
        subtitle: data.subtitle,
        description: data.description,
        image_url: data.image_url,
        notes: {
          top: data.top_notes,
          middle: data.middle_notes,
          base: data.base_notes
        },
        isNew: data.is_new,
        variants: data.variants || [],
        price_2ml: data.variants?.find(v => v.size === '2 ML')?.price || 0,
        price_5ml: data.variants?.find(v => v.size === '5 ML')?.price || 0,
        price_10ml: data.variants?.find(v => v.size === '10 ML')?.price || 0,
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      return null
    }
  },

  /**
   * Seed Mock Data to Supabase
   */
  async seedDatabase() {
    try {
      // Create categories
      const categories = ['Woody', 'Floral', 'Fresh', 'Sweet']
      const catMap = {}
      
      for (const cat of categories) {
        let { data } = await supabase.from('categories').select('id').eq('name', cat).single()
        if (!data) {
          const { data: newCat } = await supabase.from('categories').insert({ name: cat, slug: cat.toLowerCase() }).select().single()
          catMap[cat] = newCat.id
        } else {
          catMap[cat] = data.id
        }
      }

      // Create brands
      const brands = ['Wangiin Signature', 'HMNS', 'Afnan', 'Mykonos']
      const brandMap = {}
      
      for (const b of brands) {
        let { data } = await supabase.from('brands').select('id').eq('name', b).single()
        if (!data) {
          // Fallback classification logic for mock seed
          let cls = 'Local'
          if (b === 'Afnan') cls = 'Middle Eastern'
          if (b === 'Wangiin Signature') cls = 'Niche'
          
          const { data: newBrand } = await supabase.from('brands').insert({ 
            name: b, 
            slug: b.toLowerCase().replace(/ /g, '-'),
            classification: cls
          }).select().single()
          brandMap[b] = newBrand.id
        } else {
          brandMap[b] = data.id
        }
      }

      // 2. Insert Products and Variants
      for (const p of mockProducts) {
        const catId = catMap[p.category] || catMap['Woody']
        const brandId = brandMap[p.brand] || brandMap['Wangiin Signature']
        
        const { data: existing } = await supabase.from('products').select('id').eq('slug', p.id.toLowerCase()).single()
        if (existing) continue // skip if already seeded
        
        const { data: newProduct, error: pErr } = await supabase.from('products').insert({
          name: p.name,
          slug: p.id.toLowerCase(),
          brand_id: brandId,
          subtitle: p.notes,
          description: p.description,
          top_notes: p.top_notes,
          middle_notes: p.middle_notes,
          base_notes: p.base_notes,
          is_new: p.isNew
        }).select().single()

        if (pErr) {
          console.error('Error inserting product', pErr)
          continue
        }

        // Insert Many-to-Many Category relation
        await supabase.from('product_categories').insert({
          product_id: newProduct.id,
          category_id: catId
        })

        // Insert Variants
        await supabase.from('product_variants').insert([
          { product_id: newProduct.id, size: '2 ML', price: p.price_2ml, stock: 100 },
          { product_id: newProduct.id, size: '5 ML', price: p.price_5ml, stock: 100 },
          { product_id: newProduct.id, size: '10 ML', price: p.price_10ml, stock: 100 }
        ])
      }
      return true
    } catch (err) {
      console.error('Seeding error', err)
      return false
    }
  },

  async getFeaturedProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, is_new, subtitle, image_url, brand:brands(name, classification), categories(name), variants:product_variants(size, price)')
        .limit(4) // Just get 4 items for featured
      
      if (error) throw error
      
      return data.map(p => ({
        id: p.id,
        name: p.name,
        brand: p.brand?.name || 'Unknown Brand',
        classification: p.brand?.classification || 'Local',
        category: p.categories?.map(c => c.name).join(', '),
        categoryList: p.categories?.map(c => c.name) || [],
        subtitle: p.subtitle,
        image_url: p.image_url,
        isNew: p.is_new,
        price_2ml: p.variants?.find(v => v.size === '2 ML')?.price || 0,
        price_5ml: p.variants?.find(v => v.size === '5 ML')?.price || 0,
        price_10ml: p.variants?.find(v => v.size === '10 ML')?.price || 0,
      }))
    } catch(err) {
      console.error('Featured error', err)
      return []
    }
  },

  async getCategories() {
    try {
      const { data, error } = await supabase.from('categories').select('name')
      if (error) throw error
      return ['All', ...data.map(c => c.name)]
    } catch (err) {
      return ['All', 'Woody', 'Fresh', 'Floral', 'Sweet']
    }
  },

  async getBrands() {
    try {
      const { data, error } = await supabase.from('brands').select('name')
      if (error) throw error
      return ['All', ...data.map(b => b.name)]
    } catch (err) {
      return ['All']
    }
  }
}
