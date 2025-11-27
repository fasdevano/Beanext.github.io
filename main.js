function animateCounter(el) {
  const target = parseFloat(el.getAttribute("data-target"));
  const duration = 2000;
  const increment = target / (duration / 16);
  const isDecimal = target % 1 !== 0;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;

    if (current >= target) {
      current = target;
      clearInterval(timer);
    }

    if (isDecimal) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current).toLocaleString("id-ID");
    }
  }, 16);
}

function animateAllCounters() {
  const counters = document.querySelectorAll(".stat-number");
  counters.forEach((counter, index) => {
    setTimeout(() => {
      animateCounter(counter);
    }, index * 200);
  });
}

// Animasi otomatis saat halaman dimuat
window.addEventListener("load", () => {
  setTimeout(animateAllCounters, 500);
});

// Animasi saat scroll (Intersection Observer)
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target.querySelector(".stat-number");
        if (counter && counter.textContent === "0") {
          animateCounter(counter);
        }
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".stat-card").forEach((card) => {
  observer.observe(card);
});

// ========================================
// FORM SUBMISSION KE GOOGLE SHEETS
// ========================================

// GANTI URL INI DENGAN URL WEB APP ANDA!
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyUHCA7hROoQ8HgAmOh8MVr_5KgvYq4oHt1T40gVll9FTNeJB-ErWnXSEv8gUlYxxOP/exec';

// Fungsi untuk menampilkan loading
function showLoading() {
  const button = document.querySelector('.btn-submit');
  button.disabled = true;
  button.innerHTML = '⏳ Mengirim Data...';
}

// Fungsi untuk hide loading
function hideLoading() {
  const button = document.querySelector('.btn-submit');
  button.disabled = false;
  button.innerHTML = '🚀 Kirim Pendaftaran';
}

// Fungsi untuk close modal
function closeModal() {
  document.getElementById('successModal').classList.remove('active');
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('beasiswaForm');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validasi URL Web App
      if (WEB_APP_URL === 'https://script.google.com/macros/s/AKfycbyUHCA7hROoQ8HgAmOh8MVr_5KgvYq4oHt1T40gVll9FTNeJB-ErWnXSEv8gUlYxxOP/exec') {
        alert('⚠️ ERROR: URL Web App belum diisi!\n\nSilakan ganti WEB_APP_URL di file main.js dengan URL dari Google Apps Script Anda.');
        return;
      }
      
      showLoading();
      
      // Ambil data dari form
      const formData = new FormData(form);
      const data = {};
      
      // Convert FormData ke object (tanpa file)
      for (let [key, value] of formData.entries()) {
        // Skip file inputs
        if (value instanceof File) {
          data[key] = value.name; // Simpan nama file saja
        } else {
          data[key] = value;
        }
      }
      
      console.log('Data yang akan dikirim:', data);
      
      try {
        // Kirim data ke Google Apps Script
        const response = await fetch(WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors', // Penting untuk Google Apps Script
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        
        console.log('Response diterima');
        
        // Karena mode no-cors, kita tidak bisa membaca response
        // Tapi jika tidak ada error, anggap berhasil
        hideLoading();
        
        // Tampilkan modal success
        document.getElementById('successModal').classList.add('active');
        
        // Reset form
        form.reset();
        
        // Scroll ke atas
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
      } catch (error) {
        console.error('Error:', error);
        hideLoading();
        
        // Tampilkan error alert
        alert('❌ Terjadi kesalahan saat mengirim data.\n\nDetail error: ' + error.message + '\n\nSilakan coba lagi atau hubungi administrator.');
      }
    });
  }
});

// ========================================
// VALIDASI FORM REAL-TIME
// ========================================

// Validasi NIK (harus 16 digit angka)
const nikInput = document.querySelector('input[name="nik"]');
if (nikInput) {
  nikInput.addEventListener('input', function(e) {
    const value = e.target.value;
    // Hanya izinkan angka
    e.target.value = value.replace(/[^0-9]/g, '');
    
    // Validasi panjang
    if (e.target.value.length === 16) {
      e.target.style.borderColor = '#10b981';
    } else {
      e.target.style.borderColor = '#ef4444';
    }
  });
}

// Validasi nomor telepon
const phoneInput = document.querySelector('input[name="telepon"]');
if (phoneInput) {
  phoneInput.addEventListener('input', function(e) {
    const value = e.target.value;
    // Hanya izinkan angka
    e.target.value = value.replace(/[^0-9]/g, '');
    
    // Validasi format (harus dimulai dengan 08)
    if (e.target.value.startsWith('08') && e.target.value.length >= 10) {
      e.target.style.borderColor = '#10b981';
    } else {
      e.target.style.borderColor = '#ef4444';
    }
  });
}

// Validasi email
const emailInput = document.querySelector('input[name="email"]');
if (emailInput) {
  emailInput.addEventListener('blur', function(e) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(e.target.value)) {
      e.target.style.borderColor = '#10b981';
    } else {
      e.target.style.borderColor = '#ef4444';
    }
  });
}

// Validasi file size (max 2MB)
const fileInputs = document.querySelectorAll('input[type="file"]');
fileInputs.forEach(input => {
  input.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        alert(`❌ File ${file.name} terlalu besar!\n\nUkuran maksimal: 2MB\nUkuran file Anda: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        e.target.value = '';
      } else {
        console.log(`✅ File ${file.name} valid (${(file.size / 1024).toFixed(2)} KB)`);
      }
    }
  });
});

      // Tampilkan modal success
      document.getElementById("successModal").classList.add("active");
      e.target.reset();
    } catch (error) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
      console.error(error);
    }
  });

// Fungsi close modal
function closeModal() {
  document.getElementById("successModal").classList.remove("active");
}

