<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageCircle, Instagram, Mail, ArrowRight } from 'lucide-vue-next'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)

const contacts = [
  {
    icon: MessageCircle,
    platform: 'WhatsApp',
    handle: '+62 812-3456-7890',
    link: 'https://wa.me/6281234567890',
    primary: true
  },
  {
    icon: Instagram,
    platform: 'Instagram',
    handle: '@wangiin.id',
    link: '#',
    primary: false
  },
  {
    icon: Mail,
    platform: 'Email',
    handle: 'hello@wangiin.com',
    link: 'mailto:hello@wangiin.com',
    primary: false
  }
]

onMounted(() => {
  const elements = sectionRef.value.querySelectorAll('.contact-animate')
  
  gsap.fromTo(elements, 
    { y: 40, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
      }
    }
  )
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="py-24 md:py-32 border-b border-brand-primary/10 relative overflow-hidden bg-brand-surface-lowest">
    <!-- Ambient Glow -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-brand-secondary/5 rounded-full blur-[140px] mix-blend-screen"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <!-- Left: Text Content -->
        <div class="contact-animate">
          <span class="font-mono text-[10px] md:text-xs font-medium tracking-[0.3em] uppercase text-brand-secondary mb-4 block flex items-center gap-4">
            <div class="h-[1px] w-8 bg-brand-secondary"></div>
            07 / Hubungi Kami
          </span>
          <h2 class="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide mb-8">
            Let's Connect
          </h2>
          <p class="font-body text-lg text-brand-on-surface-variant leading-relaxed max-w-md mb-12">
            Butuh rekomendasi parfum yang pas buat hangout, bingung pilih wangi, atau mau tanya soal stock? Jangan ragu buat chat admin kita ya.
          </p>
          
          <div class="hidden lg:block w-32 h-[1px] bg-brand-primary/20"></div>
        </div>

        <!-- Right: Contact Cards -->
        <div class="flex flex-col gap-6">
          <a v-for="(item, index) in contacts" :key="index" :href="item.link" target="_blank"
             class="contact-animate group relative overflow-hidden border p-6 flex items-center justify-between transition-all duration-500"
             :class="item.primary ? 'bg-brand-primary/5 border-brand-secondary/40 hover:bg-brand-secondary/10' : 'bg-brand-surface border-brand-primary/10 hover:border-brand-secondary hover:bg-brand-secondary/[0.03]'">
             
             <!-- Hover Accent Line -->
             <div class="absolute left-0 top-0 h-full w-[2px] bg-brand-secondary scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500"></div>

             <div class="flex items-center gap-6 relative z-10">
               <div class="w-12 h-12 flex items-center justify-center border transition-colors duration-500"
                    :class="item.primary ? 'border-brand-secondary/50 bg-brand-deep-black group-hover:border-brand-secondary group-hover:shadow-[0_0_15px_rgba(168,200,255,0.2)]' : 'border-brand-primary/20 bg-brand-surface group-hover:border-brand-secondary/50'">
                 <component :is="item.icon" class="w-5 h-5 transition-colors duration-500" :class="item.primary ? 'text-brand-secondary' : 'text-brand-primary/70 group-hover:text-brand-secondary'" />
               </div>
               
               <div>
                 <h3 class="font-mono text-[10px] tracking-[0.2em] uppercase text-brand-interface-gray mb-1">{{ item.platform }}</h3>
                 <span class="font-display text-xl font-bold tracking-wide group-hover:text-brand-secondary transition-colors duration-300">{{ item.handle }}</span>
               </div>
             </div>

             <ArrowRight class="w-5 h-5 text-brand-primary/30 group-hover:text-brand-secondary group-hover:translate-x-2 transition-all duration-500" />
          </a>
        </div>

      </div>

    </div>
  </section>
</template>
