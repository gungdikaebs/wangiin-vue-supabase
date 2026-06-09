<script setup>
import { Instagram, Twitter, Mail } from 'lucide-vue-next'
</script>

<template>
  <footer class="bg-brand-deep-black border-t border-brand-primary/10 pt-20 pb-10">
    <div class="max-w-7xl mx-auto px-6 md:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
        
        <!-- Brand -->
        <div class="md:col-span-2">
          <h4 class="font-mono text-sm font-semibold tracking-[0.15em] uppercase text-brand-primary mb-6">Wangiin</h4>
          <p class="font-body text-brand-on-surface-variant max-w-sm leading-relaxed mb-8">
            Wangiin hadir buat kamu yang mau tampil wangi setiap saat. Kami nyediain koleksi decant parfum original pilihan buat nemenin setiap gaya dan aktivitasmu.
          </p>
          <div class="flex gap-4">
            <a href="#" class="text-brand-interface-gray hover:text-brand-secondary transition-colors duration-200">
              <Instagram class="w-5 h-5" />
            </a>
            <a href="#" class="text-brand-interface-gray hover:text-brand-secondary transition-colors duration-200">
              <Twitter class="w-5 h-5" />
            </a>
            <a href="#" class="text-brand-interface-gray hover:text-brand-secondary transition-colors duration-200">
              <Mail class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-mono text-xs font-semibold tracking-[0.15em] uppercase text-brand-interface-gray mb-6">Eksplorasi</h4>
          <ul class="flex flex-col gap-4 font-body text-sm text-brand-on-surface">
            <li><a href="#about" class="hover:text-brand-secondary transition-colors duration-200">Tentang Kami</a></li>
            <li><a href="#collection" class="hover:text-brand-secondary transition-colors duration-200">Koleksi</a></li>
            <li><a href="#testimonials" class="hover:text-brand-secondary transition-colors duration-200">Ulasan Pelanggan</a></li>
            <li><a href="#faq" class="hover:text-brand-secondary transition-colors duration-200">FAQ</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h4 class="font-mono text-xs font-semibold tracking-[0.15em] uppercase text-brand-interface-gray mb-6">Legal</h4>
          <ul class="flex flex-col gap-4 font-body text-sm text-brand-on-surface">
            <li><a href="#" class="hover:text-brand-secondary transition-colors duration-200">Kebijakan Privasi</a></li>
            <li><a href="#" class="hover:text-brand-secondary transition-colors duration-200">Syarat Ketentuan</a></li>
            <li><a href="#" class="hover:text-brand-secondary transition-colors duration-200">Informasi Pengiriman</a></li>
            <li><a href="#" class="hover:text-brand-secondary transition-colors duration-200">Kebijakan Pengembalian</a></li>
          </ul>
        </div>
      </div>

      <!-- Copyright -->
      <div class="pt-8 border-t border-brand-primary/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <span class="font-mono text-xs text-brand-interface-gray tracking-wider">
          © 2026 WANGIIN. HAK CIPTA DILINDUNGI.
        </span>
        <span class="font-mono text-xs text-brand-interface-gray tracking-wider">
          REKAYASA AROMA STRUKTURAL
        </span>
      </div>
    </div>
  </footer>
</template>
