<script setup>
import { useHead } from '@unhead/vue'
import HeroSection from '../components/landing/HeroSection.vue'
import AboutBrand from '../components/landing/AboutBrand.vue'
import FeaturedProducts from '../components/landing/FeaturedProducts.vue'
import WhyChooseUs from '../components/landing/WhyChooseUs.vue'
import Testimonials from '../components/landing/Testimonials.vue'
import FaqSection from '../components/landing/FaqSection.vue'
import ContactSection from '../components/landing/ContactSection.vue'

// SEO Configuration
useHead({
  title: 'Wangiin | Premium Scent Engineering',
  meta: [
    {
      name: 'description',
      content: 'Wangiin offers curated decants and premium scent analysis. Discover the anatomy of luxury fragrance.'
    }
  ]
})
</script>

<template>
  <div class="landing-page">
    <HeroSection />
    <AboutBrand id="about" />
    <FeaturedProducts id="collection" />
    <WhyChooseUs />
    <Testimonials id="testimonials" />
    <FaqSection id="faq" />
    <ContactSection />
  </div>
</template>
