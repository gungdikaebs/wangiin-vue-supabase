<script setup>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { gsap } from 'gsap'
import { ArrowLeft, RefreshCw } from 'lucide-vue-next'
import { productService } from '../../services/productService'

useHead({
  title: 'Scent Finder | Wangiin'
})

const router = useRouter()

onMounted(() => {
  const savedResults = localStorage.getItem('wangiin_quiz_results')
  if (savedResults) {
    try {
      recommendedProducts.value = JSON.parse(savedResults)
      currentStep.value = 6 // Skip straight to results
      
      // Animate results
      nextTick(() => {
        gsap.fromTo('.result-card',
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
        )
      })
    } catch (e) {
      console.error('Failed to parse saved quiz results')
    }
  }
})

const questions = [
  {
    id: 1,
    question: "Untuk acara seperti apa parfum ini akan Anda pakai?",
    options: [
      { id: 'formal', label: 'Acara Formal / Spesial', desc: 'Rapat, Pesta, Kencan Malam' },
      { id: 'casual', label: 'Aktivitas Santai / Harian', desc: 'Hangout, Ngampus, Jalan-jalan' }
    ]
  },
  {
    id: 2,
    question: "Aroma dasar seperti apa yang paling menarik bagi Anda?",
    options: [
      { id: 'fresh', label: 'Segar & Ringan (Fresh)', desc: 'Citrus, Aquatic, Bersih' },
      { id: 'sweet_spicy', label: 'Manis / Hangat (Sweet/Spicy)', desc: 'Vanilla, Rempah, Kayu, Bunga Intens' }
    ]
  },
  {
    id: 3,
    question: "Kapan Anda biasanya menggunakan parfum ini?",
    options: [
      { id: 'day', label: 'Siang Hari', desc: 'Matahari terik, cuaca panas' },
      { id: 'night', label: 'Malam Hari', desc: 'Cuaca sejuk, acara malam' }
    ]
  },
  {
    id: 4,
    question: "Di mana Anda lebih banyak menghabiskan waktu?",
    options: [
      { id: 'indoor', label: 'Di Dalam Ruangan (Indoor)', desc: 'Ruang ber-AC, Kantor, Cafe' },
      { id: 'outdoor', label: 'Di Luar Ruangan (Outdoor)', desc: 'Lapangan, Jalanan, Taman' }
    ]
  }
]

const currentStep = ref(0) // 0 = Intro, 1-4 = Questions, 5 = Loading, 6 = Results
const answers = ref({
  q1: null,
  q2: null,
  q3: null,
  q4: null
})

const recommendedProducts = ref([])

// Animations refs
const questionTitle = ref(null)
const optionButtons = ref([])

const startQuiz = async () => {
  currentStep.value = 1
  await nextTick()
  animateQuestionIn()
}

const selectOption = async (questionIndex, optionId) => {
  answers.value[`q${questionIndex}`] = optionId

  if (questionIndex < 4) {
    // Animate out then next
    await animateQuestionOut()
    currentStep.value = questionIndex + 1
    await nextTick()
    animateQuestionIn()
  } else {
    // Finish Quiz
    await animateQuestionOut()
    currentStep.value = 5 // Loading
    await calculateResults()
  }
}

const animateQuestionIn = () => {
  gsap.fromTo('.quiz-title',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
  )
  gsap.fromTo('.quiz-option',
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
    '-=0.6'
  )
}

const animateQuestionOut = () => {
  return new Promise(resolve => {
    gsap.to(['.quiz-title', '.quiz-option'], {
      y: -30,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: 'power2.in',
      onComplete: resolve
    })
  })
}

const calculateResults = async () => {
  // Simulate network delay for effect
  await new Promise(r => setTimeout(r, 1500))

  // Fetch all products
  const { data: products } = await productService.getProducts({ limit: 50 })

  // Calculate scores
  const scoredProducts = products.map(product => {
    let score = 0
    const cats = product.categoryList || []
    const cls = product.classification || ''

    // Q1: Formal / Casual
    if (answers.value.q1 === 'formal') {
      if (cats.includes('Woody')) score += 2
      if (cats.includes('Floral')) score += 1
      // No classification bias here based on user feedback
    } else {
      if (cats.includes('Fresh')) score += 2
      if (cats.includes('Sweet')) score += 1
    }

    // Q2: Fresh / Sweet Spicy
    if (answers.value.q2 === 'fresh') {
      if (cats.includes('Fresh')) score += 3
      if (cats.includes('Woody')) score += 1
    } else {
      if (cats.includes('Sweet')) score += 3
      if (cats.includes('Woody')) score += 2 // Spicy maps well to Woody
      if (cats.includes('Floral')) score += 1
      if (cls === 'Timteng' || cls === 'Middle Eastern') score += 2
    }

    // Q3: Day / Night
    if (answers.value.q3 === 'day') {
      if (cats.includes('Fresh')) score += 2
      if (cats.includes('Floral')) score += 1
    } else {
      if (cats.includes('Woody')) score += 2
      if (cats.includes('Sweet')) score += 2
      if (cls === 'Timteng' || cls === 'Middle Eastern') score += 1
    }

    // Q4: Indoor / Outdoor
    if (answers.value.q4 === 'indoor') {
      if (cats.includes('Floral')) score += 2
      if (cats.includes('Sweet')) score += 1
    } else {
      if (cats.includes('Fresh')) score += 2
      if (cats.includes('Woody')) score += 1
    }

    return { ...product, quizScore: score }
  })

  // Sort by score descending
  scoredProducts.sort((a, b) => b.quizScore - a.quizScore)

  // Take top 3
  recommendedProducts.value = scoredProducts.slice(0, 3)
  
  // Save to LocalStorage
  localStorage.setItem('wangiin_quiz_results', JSON.stringify(recommendedProducts.value))

  currentStep.value = 6 // Results

  await nextTick()
  gsap.fromTo('.result-card',
    { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.2 }
  )
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const restartQuiz = () => {
  localStorage.removeItem('wangiin_quiz_results')
  currentStep.value = 0
  answers.value = { q1: null, q2: null, q3: null, q4: null }
}
</script>

<template>
  <div class="min-h-screen bg-brand-deep-black text-brand-on-surface flex flex-col relative overflow-hidden">
    <!-- Ambient Glows -->
    <div class="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-32 -left-32 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[140px] mix-blend-screen">
      </div>
      <div
        class="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] mix-blend-screen">
      </div>
    </div>

    <!-- Header / Nav -->
    <header class="relative z-20 py-8 px-6 md:px-12 flex justify-between items-center">
      <router-link to="/"
        class="font-editorial text-2xl tracking-widest uppercase text-brand-primary">Wangiin</router-link>
      <router-link to="/"
        class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-brand-interface-gray hover:text-brand-primary transition-colors">
        Tutup
        <ArrowLeft class="w-3 h-3 rotate-180" />
      </router-link>
    </header>

    <main class="flex-grow flex flex-col justify-center relative z-10 max-w-4xl mx-auto w-full px-6">

      <!-- Progress Bar -->
      <div v-if="currentStep > 0 && currentStep <= 4" class="absolute top-0 left-0 w-full h-1 bg-brand-surface-lowest">
        <div class="h-full bg-brand-secondary transition-all duration-500"
          :style="{ width: `${(currentStep / 4) * 100}%` }"></div>
      </div>
      <div v-if="currentStep > 0 && currentStep <= 4"
        class="font-mono text-[10px] text-brand-interface-gray tracking-[0.3em] uppercase mb-12 text-center">
        Pertanyaan {{ currentStep }} / 4
      </div>

      <!-- Step 0: Intro -->
      <div v-if="currentStep === 0" class="text-center">
        <span
          class="font-mono text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-brand-secondary mb-6 block">Scent
          Finder</span>
        <h1 class="font-editorial text-5xl md:text-7xl font-light mb-8 text-brand-primary leading-tight">Temukan
          Aroma<br><span class="italic text-transparent"
            style="-webkit-text-stroke: 1px var(--color-brand-primary);">Khas Kamu</span></h1>
        <p class="font-body text-brand-on-surface-variant max-w-md mx-auto mb-12">Jawab 4 pertanyaan singkat ini dan
          biarkan algoritma kami memilihkan decant parfum yang paling sesuai dengan kepribadian dan gaya hidup Anda.</p>
        <button @click="startQuiz"
          class="inline-flex items-center justify-center gap-4 font-mono text-xs font-medium uppercase tracking-[0.2em] px-8 py-5 bg-brand-primary text-brand-on-primary hover:bg-brand-secondary hover:text-brand-on-secondary transition-colors duration-500">
          Mulai Kuis
        </button>
      </div>

      <!-- Steps 1-4: Questions -->
      <template v-for="(q, idx) in questions" :key="q.id">
        <div v-if="currentStep === q.id" class="w-full">
          <h2
          class="quiz-title font-editorial text-3xl md:text-5xl font-light text-center mb-16 text-brand-primary leading-tight max-w-2xl mx-auto">
          {{ q.question }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button v-for="opt in q.options" :key="opt.id" @click="selectOption(q.id, opt.id)"
            class="quiz-option text-left p-8 border border-brand-primary/20 bg-brand-surface hover:bg-brand-primary/5 hover:border-brand-primary transition-all duration-300 group relative overflow-hidden">
            <!-- Hover effect bg -->
            <div
              class="absolute inset-0 bg-brand-secondary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
            </div>

            <div class="relative z-10">
              <h3 class="font-display text-xl uppercase tracking-wide text-brand-primary mb-2">{{ opt.label }}</h3>
              <p class="font-mono text-[10px] uppercase tracking-widest text-brand-interface-gray">{{ opt.desc }}</p>
            </div>
          </button>
        </div>
      </div>
      </template>

      <!-- Step 5: Loading -->
      <div v-if="currentStep === 5" class="text-center flex flex-col items-center">
        <div class="w-12 h-12 border-b-2 border-brand-secondary rounded-full animate-spin mb-8"></div>
        <h2 class="font-editorial text-3xl font-light text-brand-primary mb-2">Meracik Rekomendasi...</h2>
        <p class="font-mono text-[10px] uppercase tracking-widest text-brand-interface-gray">Menganalisa aroma yang
          tepat untuk Anda</p>
      </div>

      <!-- Step 6: Results -->
      <div v-if="currentStep === 6" class="w-full">
        <div class="text-center mb-16">
          <span
            class="font-mono text-[10px] md:text-xs font-semibold tracking-[0.3em] uppercase text-brand-secondary mb-6 block">Kecocokan
            Tertinggi</span>
          <h2 class="font-editorial text-4xl md:text-6xl font-light text-brand-primary">Ini Wangi Anda.</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <router-link v-for="(product, idx) in recommendedProducts" :key="product.id" :to="`/product/${product.id}`"
            class="result-card group block">
            <!-- Image Area -->
            <div
              class="relative w-full aspect-[3/4] bg-brand-surface mb-6 overflow-hidden border border-brand-primary/10 group-hover:border-brand-primary/30 transition-colors">
              <img v-if="product.image_url" :src="product.image_url" :alt="product.name"
                class="w-full h-full object-cover mix-blend-lighten opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
              <div v-else class="w-full h-full flex items-center justify-center p-8">
                <div class="w-16 h-32 border border-brand-primary/20 relative">
                  <div class="absolute top-0 left-1/2 -translate-x-1/2 -mt-3 w-4 h-3 border border-brand-primary/20">
                  </div>
                </div>
              </div>

              <!-- Match Badge -->
              <div
                class="absolute top-4 right-4 bg-brand-deep-black/80 backdrop-blur-sm border border-brand-secondary/30 px-3 py-1 font-mono text-[9px] uppercase tracking-widest text-brand-secondary">
                Top {{ idx + 1 }} Match
              </div>
            </div>

            <!-- Details -->
            <div>
              <div class="font-mono text-[9px] text-brand-interface-gray tracking-widest uppercase mb-2">{{
                product.brand }}</div>
              <h3 class="font-display text-lg uppercase tracking-wider text-brand-primary mb-1">{{ product.name }}</h3>
              <p class="font-body text-xs text-brand-on-surface-variant line-clamp-2 mb-4">{{ product.subtitle ||
                product.description }}</p>
              <div class="font-mono text-xs tracking-widest text-brand-secondary">Mulai {{
                formatPrice(product.price_2ml) }}</div>
            </div>
          </router-link>
        </div>

        <div class="mt-16 flex justify-center">
          <button @click="restartQuiz"
            class="flex items-center gap-3 font-mono text-[10px] uppercase tracking-widest text-brand-interface-gray hover:text-brand-primary transition-colors">
            <RefreshCw class="w-4 h-4" /> Ulangi Kuis
          </button>
        </div>
      </div>

    </main>
  </div>
</template>
