# Fleet Management System 🚌

Aplikasi Frontend Sistem Manajemen Armada (Fleet Management) modern berbasis **React 19**, **TypeScript**, dan **Tailwind CSS**, terintegrasi langsung dengan REST API [MBTA V3](https://api-v3.mbta.com).

## 🚀 Fitur Utama

1. **Pengambilan Data Kendaraan (REST API)**:
   - Terintegrasi langsung dengan endpoint `https://api-v3.mbta.com/vehicles`.
   - Mengambil relasi `route`, `trip`, dan `stop` secara efisien (`include=route,trip,stop`).

2. **Tampilan Card & Pagination**:
   - Tampilan grid responsif berbasis Card.
   - Atribut yang ditampilkan:
     - Label kendaraan (atau ID)
     - Status terkini (`IN_TRANSIT_TO`, `STOPPED_AT`, `INCOMING_AT`, dll.)
     - Koordinat Latitude & Longitude dengan tombol salin (copy)
     - Waktu pembaruan terakhir (relatif dan absolut)
     - Detail kecepatan, bearing (arah mata angin), dan badge rute
   - Kontrol Pagination lengkap:
     - Rentang data yang sedang ditampilkan (misal: *Menampilkan 1-9 dari 410 Data*)
     - Pilihan jumlah data per halaman (dropdown: 6, 9, 12, 18, 24)
     - Jumlah halaman yang tersedia (*Halaman X dari Y*)
     - Tombol navigasi (Awal `<<`, Sebelumnya `<`, Nomor halaman dengan ellipsis `...`, Berikutnya `>`, Akhir `>>`)
        - > **Catatan Pencarian Armada (Search Box):** Pencarian teks label/ID armada dijalankan secara **lokal (client-side)** pada data yang sedang dimuat. Hal ini dikarenakan MBTA REST API tidak memiliki parameter pencarian teks bebas (*fuzzy / partial text search* seperti `?search=` atau `?q=`).

3. **Filter Dropdown Rute & Trip dengan Infinite Scroll**:
   - Filter multiselect untuk Rute dan Trip.
   - Fetching data rute dan trip secara paginated/lazy load menggunakan **Infinite Scroll** saat pengguna menggulir daftar dropdown ke bawah.
   - Fitur pencarian instan di dalam dropdown.
   - Dependensi cerdas: Pilihan rute secara otomatis mempersempit daftar trip yang tersedia.
   - Tag filter aktif dengan tombol hapus cepat per item dan tombol reset semua filter.

4. **Detail Kendaraan (Popup Modal)**:
   - Menampilkan detail lengkap armada:
     - Label kendaraan & status
     - Koordinat Latitude & Longitude
     - **Peta Interaktif Real-Time** menggunakan Leaflet dengan marker dinamis dan popup
     - Waktu pembaruan terakhir
     - Data Rute lengkap (Nama rute, kategori, tipe, warna, destinasi)
     - Data Trip lengkap (Headsign / tujuan, ID, arah, aksesibilitas kursi roda, izin sepeda)
     - Parameter teknis (kecepatan, bearing, nomor urutan halte, status pendapatan armada)

---

## 📁 Struktur Direktori

```
src/
├── types/                 # Definisi TypeScript
│   └── index.ts           # Vehicle, Route, Trip, JsonApiResponse, PaginationState
├── services/              # Layanan API & Integrasi data
│   ├── apiClient.ts       # Base fetcher, in-memory cache TTL, & error handler
│   ├── vehicleService.ts  # Endpoint /vehicles dengan pagination & filtering
│   ├── routeService.ts    # Endpoint /routes (paginated)
│   └── tripService.ts     # Endpoint /trips (paginated dengan filter rute)
├── hooks/                 # Custom React Hooks
│   ├── useVehicles.ts     # State management armada, pagination, & filtering
│   ├── useInfiniteRoutes.ts # Infinite scroll data rute
│   ├── useInfiniteTrips.ts  # Infinite scroll data trip
│   └── useDebounce.ts     # Input debounce
├── utils/                 # Utility functions
│   ├── formatters.ts      # Pemformat waktu, status badge, koordinat, kecepatan
│   └── pagination.ts      # Perhitungan offset, total item, & pagination range
├── components/            # Komponen UI Reusable
│   ├── common/            # Badge, LoadingSkeleton, ErrorState, EmptyState
│   ├── filters/           # InfiniteSelect, RouteFilter, TripFilter, FilterSection
│   ├── vehicles/          # VehicleCard, VehicleGrid, VehicleDetailModal, VehicleMap
│   ├── pagination/        # PaginationBar
│   └── layout/            # Header, Footer
├── App.tsx                # Komponen Utama
├── main.tsx               # Entry Point
└── index.css              # Tailwind CSS & Leaflet styles
```

---

## 🛠️ Menjalankan Proyek

1. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

2. **Konfigurasi Environment**:
   ```bash
   cp .env.example .env
   ```

3. **Menjalankan Server Development**:
   ```bash
   npm run dev
   ```

4. **Build Project**:
   ```bash
   npm run build
   ```

5. **Linting Kode**:
   ```bash
   npm run lint
   ```
